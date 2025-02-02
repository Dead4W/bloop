#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod backend;
mod qdrant;

use once_cell::sync::Lazy;
use sysinfo::{ProcessExt, ProcessRefreshKind, RefreshKind, Signal, System, SystemExt};
pub use tauri::{plugin, App, Manager, Runtime};

use std::{
    path::PathBuf,
    sync::{Arc, RwLock},
    thread,
    time::Duration,
};

pub static TELEMETRY: Lazy<Arc<RwLock<bool>>> = Lazy::new(|| Arc::new(RwLock::new(false)));

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

fn relative_command_path(command: impl AsRef<str>) -> Option<PathBuf> {
    let cmd = if cfg!(windows) {
        format!("{}.exe", command.as_ref())
    } else {
        command.as_ref().into()
    };

    std::env::current_exe()
        .ok()?
        .parent()
        .map(|dir| dir.join(cmd))
        .filter(|path| path.is_file())
}

#[tokio::main]
async fn main() {
    cleanup_old_processes();

    tauri::Builder::default()
        .plugin(qdrant::QdrantSupervisor::default())
        .setup(backend::initialize)
        .invoke_handler(tauri::generate_handler![
            show_folder_in_finder,
            enable_telemetry,
            disable_telemetry,
            backend::get_last_log_file,
        ])
        .run(tauri::generate_context!())
        .expect("error running tauri application");
}

#[tauri::command]
fn enable_telemetry() {
    let mut guard = TELEMETRY.write().unwrap();
    *guard = true;
}

#[tauri::command]
fn disable_telemetry() {
    let mut guard = TELEMETRY.write().unwrap();
    *guard = false;
}

#[tauri::command]
fn show_folder_in_finder(path: String) {
    let path = PathBuf::from(path).canonicalize().unwrap();

    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(path)
            .arg("-R") // will reveal the file in finder instead of opening it
            .spawn()
            .unwrap();
    }
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(path)
            .spawn()
            .unwrap();
    }
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg(path)
            .spawn()
            .unwrap();
    }
}

fn cleanup_old_processes() {
    const PROCESS_BLACKLIST: &[&str] = &["qdrant", "bleep"];

    // Limit total open files from `sysinfo` crate on Linux.
    sysinfo::set_open_files_limit(10);

    let mut sys =
        System::new_with_specifics(RefreshKind::new().with_processes(ProcessRefreshKind::new()));

    for name in PROCESS_BLACKLIST {
        for process in sys.processes_by_exact_name(name) {
            if process.kill_with(Signal::Term).is_none() && !process.kill() {
                tracing::error!(?name, "was not able to close existing process");
            }
        }
    }

    // We now wait for these processes to close.

    let mut remaining_procs = vec![];
    for _ in 0..10 {
        thread::sleep(Duration::from_millis(500));
        sys.refresh_processes();
        remaining_procs = PROCESS_BLACKLIST
            .iter()
            .flat_map(|name| sys.processes_by_exact_name(name))
            .collect();

        if remaining_procs.is_empty() {
            break;
        }
    }

    // As a last-ditch resort, kill any remaining processes.
    for proc in remaining_procs {
        proc.kill();
    }
}
