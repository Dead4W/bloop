import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Button from '../../../Button';
import TextInput from '../../../TextInput';
import SettingsRow from '../../SettingsRow';
import SettingsText from '../../SettingsText';
import { EMAIL_REGEX } from '../../../../consts/validations';
import { saveUserData } from '../../../../services/api';
import { DeviceContext } from '../../../../context/deviceContext';
import {
  getJsonFromStorage,
  saveJsonToStorage,
  USER_DATA_FORM,
} from '../../../../services/storage';

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  emailError?: string;
};

const ProfileSettings = () => {
  const { t } = useTranslation();
  const { envConfig } = useContext(DeviceContext);
  const savedForm: Form | null = useMemo(
    () => getJsonFromStorage(USER_DATA_FORM),
    [],
  );
  const [form, setForm] = useState<Form>({
    firstName: savedForm?.firstName || '',
    lastName: savedForm?.lastName || '',
    email: savedForm?.email || '',
    emailError: '',
  });

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      emailError: e.target.name === 'email' ? '' : prev.emailError,
    }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      if (form.emailError) {
        return;
      }
      saveJsonToStorage(USER_DATA_FORM, form);
      saveUserData({
        email: form.email,
        first_name: form.firstName,
        last_name: form.lastName,
        unique_id: envConfig.tracking_id || '',
      });
    },
    [form, envConfig.tracking_id],
  );

  return (
    <form className="block">

    </form>
  );
};

export default ProfileSettings;
