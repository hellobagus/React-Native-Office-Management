package com.ifcaproperty.ifcamobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.bolan9999.SpringScrollViewPackage;
import com.taluttasgiran.pickermodule.ReactNativePickerModulePackage;
import com.RNFetchBlob.RNFetchBlobPackage;

import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
    
    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
            // eg. new VectorIconsPackage()
            new RNFirebasePackage(),
              new RNFirebaseMessagingPackage(),
                new RNFirebaseNotificationsPackage(),
                  new RNDeviceInfo(),
                    new PickerPackage(),
                      new RNFetchBlobPackage(),
                        new ReactNativePickerModulePackage(),
                          new SpringScrollViewPackage()
        );
    }
  
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}