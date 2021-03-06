import { NativeModules, Linking } from 'react-native';
import { closeModalScreen, openInternalURL } from '../../src/navigation';

describe('utils', () => {
  describe('closeModalScreen()', () => {
    let iosCloseMethod;

    beforeEach(() => {
      iosCloseMethod = jest.fn();

      NativeModules.ZPReactNativeBridgeListener = {
        postEvent: iosCloseMethod
      };
    });

    it('calls the correct native method on iOS', () => {
      closeModalScreen();

      expect(iosCloseMethod.mock.calls).toMatchSnapshot();
    });

    it('passes parameters to the iOS bridge call', () => {
      const params = {
        animated: 3,
        animation_type: 'push'
      };

      closeModalScreen(params);

      expect(iosCloseMethod).toBeCalledWith(
        'dismiss_modal_view',
        params,
        expect.any(Function)
      );
    });
  });

  describe('openInternalURL(params, reactParams = {})', () => {
    let openURLMock;

    beforeEach(() => {
      openURLMock = jest.fn();

      Linking.openURL = openURLMock;
    });

    it('will call native module with correct URL', () => {
      openInternalURL(
        'SOME_PROTOCOL',
        {
          bundle: 'SingleChannelEPG',
          plugin: 'SingleChannelEPG',
          presentation: 'presentNoNavigation'
        },
        {
          channelId: 'xxx',
          channelTitle: 'BBC 4'
        }
      );

      expect(openURLMock.mock.calls).toMatchSnapshot();
    });
  });
});
