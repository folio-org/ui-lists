import { t } from '../../services';
import { useMessages } from '../useMessages';


export const useKeyCommandsMessages = () => {
  const { showErrorMessage } = useMessages();


  const noPermissionError = () => {
    showErrorMessage({message: t('commands-error.permission')});
  };

  const actionUnavailableError = () => {
    showErrorMessage({message: t('commands-error.unavailable')});
  };

  const showCommandError = (permissionError: boolean = false) => {
    if (permissionError) {
      noPermissionError();
    } else {
      actionUnavailableError();
    }
  };

  return {
    showCommandError,
    noPermissionError,
    actionUnavailableError
  }
}