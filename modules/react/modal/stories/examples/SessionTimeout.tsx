import React from 'react';
import {Modal} from '@workday/canvas-kit-react/modal';
import {PrimaryButton, SecondaryButton} from '@workday/canvas-kit-react/button';
import {Flex, Box} from '@workday/canvas-kit-react/layout';
import {BodyText} from '@workday/canvas-kit-react/text';

/**
 * Session Timeout Modal Example
 *
 * Note: The Notifications API is not supported in iOS Safari.
 * This example demonstrates platform notifications for desktop browsers.
 */
// eslint-disable-next-line compat/compat
export const SessionTimeout = () => {
  const [timeRemaining, setTimeRemaining] = React.useState(60);
  const [notificationPermission, setNotificationPermission] =
    React.useState<NotificationPermission>('default');
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // Check current notification permission status
    if ('Notification' in window) {
      // eslint-disable-next-line compat/compat
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      // eslint-disable-next-line compat/compat
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission;
    }
    return 'denied';
  };

  const sendNotification = () => {
    console.log('sendNotification called');
    console.log('Notification supported?', 'Notification' in window);
    // eslint-disable-next-line compat/compat
    console.log('Permission status:', 'Notification' in window ? Notification.permission : 'N/A');

    // eslint-disable-next-line compat/compat
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        // eslint-disable-next-line compat/compat
        const notification = new Notification('Session Timeout Warning', {
          body: `Your session will expire in ${timeRemaining} seconds. Please save your work.`,
          tag: 'session-timeout', // Prevents duplicate notifications
          requireInteraction: false, // Let the browser handle notification display normally
        });

        // Optional: handle notification clicks
        notification.onclick = () => {
          console.log('Notification clicked!');
          window.focus();
          notification.close();
        };

        notification.onerror = error => {
          console.error('Notification error:', error);
        };

        console.log('✅ Platform notification created successfully!');
      } catch (error) {
        console.error('❌ Error creating notification:', error);
      }
    } else {
      console.log('❌ Cannot send notification. Permission not granted or API not supported.');
    }
  };

  const handleExtendSession = () => {
    console.log('Session extended');
    handleModalClose();
    setTimeRemaining(60);
  };

  const handleLogout = () => {
    console.log('User logged out');
    handleModalClose();
  };

  const handleModalOpen = async () => {
    console.log('=== Modal Opening ===');
    console.log('Current permission:', notificationPermission);

    // Request notification permission when modal opens (if not already granted)
    if (notificationPermission === 'default') {
      console.log('Requesting notification permission...');
      const result = await requestNotificationPermission();
      console.log('Permission result:', result);
    }

    // Wait 5 seconds before sending notification (gives time to switch apps to see the banner)
    console.log('Waiting 5 seconds before sending notification...');
    setTimeout(() => {
      sendNotification();
    }, 5000);

    // Start countdown timer
    setTimeRemaining(60);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleModalClose = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const testNotification = async () => {
    console.log('=== Testing Notification ===');
    if (notificationPermission !== 'granted') {
      const result = await requestNotificationPermission();
      if (result !== 'granted') {
        console.log('❌ Permission denied');
        return;
      }
    }
    console.log('Waiting 5 seconds before sending notification...');
    setTimeout(() => {
      sendNotification();
    }, 5000);
  };

  return (
    <Modal>
      <Modal.Target as={PrimaryButton} onClick={handleModalOpen}>
        Simulate Session Timeout
      </Modal.Target>
      <Modal.Overlay>
        <Modal.Card>
          <Modal.Heading>Session Timeout Warning</Modal.Heading>
          <Modal.CloseIcon aria-label="Close" onClick={handleModalClose} />
          <Modal.Body>
            <BodyText size="medium" marginY="zero" marginBottom="m">
              Your session is about to expire due to inactivity. You will be automatically logged
              out in <strong>{timeRemaining} seconds</strong>.
            </BodyText>
            <BodyText size="medium" marginY="zero" marginBottom="m">
              Would you like to extend your session?
            </BodyText>
            <BodyText size="small" marginY="zero" color="licorice300">
              💡 <strong>Notification Status:</strong>{' '}
              {notificationPermission === 'granted' &&
                '✅ Enabled - Notification will appear in 5 seconds (switch to another app to see the banner!)'}
              {notificationPermission === 'denied' && '❌ Blocked - Enable in browser settings'}
              {notificationPermission === 'default' &&
                '⏳ Click the button to enable notifications'}
            </BodyText>
          </Modal.Body>
          <Flex gap="s" padding="xxs">
            <Modal.CloseButton as={PrimaryButton} onClick={handleExtendSession}>
              Extend Session
            </Modal.CloseButton>
            <Modal.CloseButton as={SecondaryButton} onClick={handleLogout}>
              Logout
            </Modal.CloseButton>
          </Flex>
        </Modal.Card>
      </Modal.Overlay>
    </Modal>
  );
};
