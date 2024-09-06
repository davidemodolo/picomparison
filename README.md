# Blindly Compare the same pictures took with different devices

_Have you ever had the need to know which one of your friends' phone takes the better pictures?_

No? Me neither, but my mother had to change her phone and her only requirement was "**It must take GOOD photos**".

So I collected a couple of pictures took with different phones and created this site to blindly compare them.

## How does this work?

# Usage

Inside the JS first few rows change the **number of pictures** per device, give **each device a name** and set the **pictures' extension**.

Devices' names must be the same as the names of the folders that contain the images taken with their relative device.

Images must be saved in each folder as "1.jpg", "2.jpg"...

## Example

We have an iPhone 14, an iPhone 15, a Google Pixel 7a and a Samsung Galaxy S23. Each phone takes 3 photos in `.jpg` format.

Inside `script.js` the first lines become:

```javascript
const PICTURES = 3;
const phones = ["iPhone14", "iPhone15", "Pixel7a", "GalaxyS23"];
const EXTENSION = ".jpg";
```

The folder structure becomes:

```
Project Folder
|   index.html
|   script.js
|   styles.css
|
└───pics
    ├───iPhone14
    |       1.jpg
    |       2.jpg
    |       3.jpg
    |
    ├───iPhone15
    |       1.jpg
    |       2.jpg
    |       3.jpg
    |
    ├───Pixel7a
    |       1.jpg
    |       2.jpg
    |       3.jpg
    |
    └───GalaxyS23
            1.jpg
            2.jpg
            3.jpg

```

**And that's it, just run the website**

TODO:

- [ ] comment code
- [ ] _better readme with examples (currently in progress)_
- [ ] this is so ugly
