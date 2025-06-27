# Digital Service Management System (Mobile Web App)

A mobile-friendly web application built with Next.js for digital service management, including smart streetlight complaint registration, local government selection, and map-based features.

## Features

- **Mobile phone-like UI**: The app is styled to look and feel like a modern mobile app.
- **Multi-language support**: Switch between English and Malayalam for all options and dropdowns.
- **Location-based selection**: Select State, District, Panchayath/Municipality, and Ward/Council.
- **Smart Streetlight Complaint**: Register complaints by post number, photo upload, or location.
- **Map integration**: Embedded map of Mangalapuram Grama Panchayat (OpenDataKerala).
- **Updates & Approvals**: View and approve complaint updates in a modal table.
- **Contact & Services**: Quick access to contact and service options.

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- npm or yarn

### Installation
```bash
npm install
# or
yarn install
```

### Running the App
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `pages/index.js` — Login/front page
- `pages/hello.js` — Dashboard and selection page
- `pages/thirdpage.js` — Map, services, and updates
- `components/MobileFrame.js` — Mobile phone frame wrapper
- `public/pic/` — App icons and images
- `styles/` — CSS modules and global styles

## Customization
- Update icons in `public/pic/` as needed.
- Edit dropdown options and translations in `pages/hello.js`.
- Adjust map or add more services in `pages/thirdpage.js`.

## License
This project is for demonstration/educational purposes. The embedded map is from [OpenDataKerala](https://map.opendatakerala.org/thiruvananthapuram/mangalapuram-grama-panchayat/).
