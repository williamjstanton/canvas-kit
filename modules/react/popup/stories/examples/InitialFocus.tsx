import React from 'react';

import {
  useCloseOnEscape,
  useCloseOnOutsideClick,
  Popup,
  usePopupModel,
  useInitialFocus,
  useReturnFocus,
  useFocusRedirect,
} from '@workday/canvas-kit-react/popup';
import {Box, Flex} from '@workday/canvas-kit-react/layout';
import {createStyles, px2rem} from '@workday/canvas-kit-styling';
import {system} from '@workday/canvas-tokens-web';
import {useUniqueId} from '@workday/canvas-kit-react/common';

const cardStyles = createStyles({
  width: px2rem(400),
});

const bodyStyles = createStyles({
  marginY: system.space.zero,
});

const flexStyles = createStyles({
  gap: system.space.x4,
  padding: system.space.x2,
});

export const InitialFocus = () => {
  const messageId = useUniqueId();
  const initialFocusRef = React.useRef(null);
  const model = usePopupModel({
    initialFocusRef,
  });

  useCloseOnOutsideClick(model);
  useCloseOnEscape(model);
  useInitialFocus(model);
  useReturnFocus(model);
  useFocusRedirect(model);

  return (
    <Popup model={model}>
      <Popup.Target>Send Message</Popup.Target>
      <Popup.Popper placement={'bottom'}>
        <Popup.Card cs={cardStyles} aria-describedby={messageId}>
          <Popup.Heading>Confirmation</Popup.Heading>
          <Popup.Body>
            <Box as="p" cs={bodyStyles} id={messageId}>
              Your message has been sent!
            </Box>
          </Popup.Body>
          <Flex cs={flexStyles}>
            <Popup.CloseButton ref={initialFocusRef}>OK</Popup.CloseButton>
          </Flex>
        </Popup.Card>
      </Popup.Popper>
    </Popup>
  );
};
