# little-lemon
Capstone project for React Native specialization: mobile app for a restaurant (Little Lemon) in which the user can initiate an account and view / filter the menu

## UI
For Figma files, see [/assets/Figma](/assets/Figma)

## Screens
* An onboarding screen which prompts the user to enter his name and email (with form validation), only on the first visit
* A profile screen in which the user can update the profile picture and data
* A home screen showing a navigation bar, a hero section (about the restaurant), menu items, and a filtering mechanism (search bar + category selectors)

## Notes
* Fetch API is used to download the menu in JSON format one, then save it to DB (`SQLite`)
* `AsyncStorage` is used to store user preferences and history
* `StackNavigation' is used between screens
![Navigation](https://github.com/3omdawy/little-lemon/assets/10769610/4752c365-53cd-4099-ba10-8f09bb182c4f)

## Additional Features (not yet implemented)
* MenuItem screen to zoom in on the menu item
* Basket management to allow the user to save his order
* Order mechanism to send an HTTP request to a restaurant API with the user order
* History of orders for the user

## Steps
```
git clone https://github.com/3omdawy/little-lemon.git
cd little-lemon
npm install
npm start
```
Run on real device or on emulator (will not work on the web due to SQLite access)
