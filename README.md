# 📺🚀 React Native Project

## 🌟 Features

- 📱 Multi-platform support: Android TV, Fire TV, tvOS, and web
- 🎨 Customizable left-side drawer navigation (using Expo Drawer)
- 🖼️ Grid layout for content selection
- 🦸‍♂️ Dynamic hero image header that follows the focused card
- 🎬 Detailed content screen
- 🎥 Video player
- 🔧 Fully customizable screens and components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [JDK 17](https://developer.android.com/build/jdks)

## 🚀 Quick Start

1. Clone the repository:

   ```
   git clone https://github.com/IrfanRa/AndroidTVOS-Projects.git
   ```

2. Navigate to the project directory:

   ```
   cd SubamericaTV
   ```

3. Install dependencies:

   ```
   npm install --legacy-peer-deps
   ```

4. Prebuild the native project optimized for TV:

   ```
   export EXPO_TV=1; npx expo prebuild 
   ```

## 📱 Running on Different Platforms

### Android TV / Fire TV

- Ensure you have an Android TV emulator set up or a physical device connected.
- Run `npx expo run:android --device <Your Device or Emulator>` to build and install the app.

### tvOS

- Make sure you have Xcode installed with tvOS Simulator.
- Run `npx expo run:ios` to build and install the app on the tvOS Simulator.

### Web

- Run `npx expo start --web` to start the app in your default web browser.

- Run `npx expo export -p web` if you want to build the app for web. After a successful build all the needed files for web will be in the ```dist``` directory

## 🛠️ Customization

- **Drawer Navigation**: Modify `./components/CustomDrawerContent.tsx` to customize the left-side menu.
- **Content Grid**: Adjust `./app/(drawer)/index.tsx` to change the layout or style of the content cards.
- **Detail Screen**: Customize `./app/details.tsx` for different content details display options.
- **Video Player**: Enhance `./app/player.tsx` to customize the Video Player Screen

Stay Tuned for more!

## 📚 Key Frameworks and Libraries Used

- [Expo](https://expo.dev/)
- [Expo Drawer](https://docs.expo.dev/router/advanced/drawer/)
- [React TV Space Navigation](https://github.com/bamlab/react-tv-space-navigation) for Focus Management, Remote control mapping and content lists.

Happy coding! 🎉 We hope this sample helps you create amazing TV experiences across multiple platforms!
