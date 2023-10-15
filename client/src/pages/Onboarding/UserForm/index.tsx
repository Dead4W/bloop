import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { BloopLogo } from '../../../icons';
import TextInput from '../../../components/TextInput';
import { EMAIL_REGEX } from '../../../consts/validations';
import Button from '../../../components/Button';
import { UIContext } from '../../../context/uiContext';
import { DeviceContext } from '../../../context/deviceContext';
import { Form } from '../index';
import Dropdown from '../../../components/Dropdown/Normal';
import { MenuItemType } from '../../../types/general';
import { Theme } from '../../../types';
import { themesMap } from '../../../components/Settings/Preferences';
import { copyToClipboard, previewTheme } from '../../../utils';
import LanguageSelector from '../../../components/LanguageSelector';
import Tooltip from '../../../components/Tooltip';
import axios from "axios";

type Props = {
  form: Form;
  setForm: Dispatch<SetStateAction<Form>>;
  onContinue: () => void;
};

const UserForm = ({ form, setForm, onContinue }: Props) => {
  const { t } = useTranslation();
  const { isGithubConnected } = useContext(
    UIContext.GitHubConnected,
  );
  const { envConfig, openLink, setEnvConfig } = useContext(DeviceContext);
  const { theme, setTheme } = useContext(UIContext.Theme);
  const [showErrors, setShowErrors] = useState(false);

  const getUsernameError = function () {
      if (!showErrors) {
          return undefined;
      }

      if (!form.username) {
          return t('Username is required');
      }

      if (form.error !== null) {
          return t(form.error);
      }

      return undefined;
  }

  const handleSubmit = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (
        !form.username ||
        !form.password
      ) {
        setShowErrors(true);
        return;
      }

      axios.post('https://api-dev.saber3d.dev/v1/login', {
        password: form.password,
        username: form.username,
      }).then(response => {
        form.user = response.data.authorized_user;

        onContinue();
      }).catch(error => {
        setShowErrors(true);
        setForm((prev) => ({
          ...prev,
          error: t(error.response.data.message),
        }));
      })
    },
    [form, onContinue],
  );

  return (
    <>
      <div className="w-full flex flex-col gap-3 text-center relative">
        <div className="absolute -top-32 left-0 right-0 flex justify-end">
          <LanguageSelector />
        </div>
        <div className="flex flex-col gap-3 text-center relative">
          <div className="w-11 h-11 absolute left-1/2 -top-16 transform -translate-x-1/2">
            <BloopLogo />
          </div>
          <h4 className="text-label-title">
            <Trans>Bloop</Trans>
          </h4>
          <p className="text-label-muted body-s">
            <Trans>Please log into your Saber account to complete</Trans>
          </p>
        </div>
      </div>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={(e) => e.preventDefault()}
      >
        <TextInput
          value={form.username}
          name="username"
          placeholder={t('Username')}
          variant="filled"
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              username: e.target.value,
              error: null,
            }))
          }
          autoFocus
          error={
            getUsernameError()
          }
        />
        <TextInput
          value={form.password}
          name="password"
          placeholder={t('Password')}
          variant="filled"
          type="password"
          onChange={(e) =>
            setForm((prev) => ({
                ...prev,
                password: e.target.value,
                error: null,
            }))
          }
          error={
            showErrors && !form.password
              ? t('Password is required')
              : undefined
          }
        />
        <div className="flex flex-col w-full">
          <Dropdown
            btnHint={
              <span className="text-label-title">
                <Trans>Select color theme:</Trans>
              </span>
            }
            btnClassName="w-full border-transparent"
            items={Object.entries(themesMap).map(([key, name]) => ({
              type: MenuItemType.DEFAULT,
              text: t(name),
              onClick: () => setTheme(key as Theme),
              onMouseOver: () => previewTheme(key),
            }))}
            onClose={() => previewTheme(theme)}
            selected={{
              type: MenuItemType.DEFAULT,
              text: t(themesMap[theme]),
            }}
          />
        </div>
        <Button onClick={handleSubmit}>
          <Trans>Login</Trans>
        </Button>
      </form>
    </>
  );
};

export default UserForm;
