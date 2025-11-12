# Datavine (Dynamic Form Builder)

This is a full-stack web application that allows users to create, share, and manage dynamic forms. It provides features for collecting responses, viewing analytics, and even handling payments through forms.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **UI Libraries:**
  - [React](https://reactjs.org/) 19
  - [Material-UI](https://mui.com/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://greensock.com/gsap/) for animations
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Payment Integration:** [Razorpay](https://razorpay.com/)
- **File Export:** [SheetJS (xlsx)](https://sheetjs.com/) for Excel export
- **3D Graphics:** [Three.js](https://threejs.org/)
- **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)

## Project Structure

```
.
├── src
│   ├── app
│   │   ├── api                 # API routes
│   │   │   ├── auth            # NextAuth.js authentication
│   │   │   ├── forms           # Form creation, sharing, and response handling
│   │   │   ├── payments        # Payment processing (Razorpay)
│   │   │   └── user            # User-related endpoints
│   │   ├── component           # Shared React components for pages
│   │   ├── home                # User dashboard and form management pages
│   │   │   ├── [formId]        # Pages for a specific form (edit, analytics, responses)
│   │   │   └── preview         # Form preview pages
│   │   ├── forms/share         # Public-facing pages for filling out forms
│   │   ├── template            # Page for selecting form templates
│   │   └── upgrade             # Page for upgrading user plan
│   ├── components              # Reusable UI components
│   │   ├── dashboard           # Components for the main user dashboard
│   │   ├── form                # Components for building and sharing forms
│   │   └── PreviewForm         # Components for form previews
│   ├── lib                   # Library functions (DB connection, user helpers)
│   ├── models                # Mongoose models for database schemas
│   ├── styles                # Custom style components and icons
│   └── utils                 # Utility functions (e.g., payment handling)
├── public                    # Static assets (images, SVGs)
└── ...                       # Config files (Next.js, ESLint, etc.)
```

## Core Features

- **User Authentication:** Secure login and registration using NextAuth.js.
- **Form Creation:** Build dynamic forms using a template-based approach.
- **Form Sharing:** Share forms with a unique link.
- **Response Collection:** Gather and store responses from users.
- **Analytics:** View analytics for each form, including response data visualization.
- **Report Generation:** Export form responses to Excel (`.xlsx`) files.
- **Payment Integration:** Accept payments through forms using Razorpay.
- **Dashboard:** A central place for users to manage their forms.

## API Endpoints

The API is built using Next.js API Routes.

- `POST /api/auth/[...nextauth]`: Handles user authentication (Google, etc.).
- `GET, POST /api/forms`: Create new forms and retrieve forms for the logged-in user.
- `GET, PUT, DELETE /api/forms/[shareId]`: Manage a specific form.
- `GET, POST /api/forms/[shareId]/responses`: Handle responses for a specific form.
- `POST /api/payments/create-order`: Creates a Razorpay order.
- `POST /api/payments/verify`: Verifies the payment signature from Razorpay.
- `GET /api/user/me`: Retrieves the current logged-in user's data.

## Database Schema

Mongoose is used for object data modeling.

### `User` Model (`src/models/User.ts`)
- `name`: `String`
- `email`: `String` (unique)
- `image`: `String`
- `emailVerified`: `Date`

### `Form` Model (`src/models/Form.ts`)
- `userId`: `mongoose.Schema.Types.ObjectId` (ref: 'User')
- `title`: `String`
- `description`: `String`
- `questions`: `Array` (of question objects)
- `responses`: `Array` (of response objects)
- `shareId`: `String` (unique)
- `createdAt`: `Date`
- `templateId`: `String`

### `UserData` Model (`src/models/UserData.ts`)
- `userId`: `mongoose.Schema.Types.ObjectId` (ref: 'User')
- `forms`: `Array` (of form IDs)
- `plan`: `String` (e.g., 'free', 'premium')

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vishalvishwas01/Datavine
    cd Datavine
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add the following variables:
    ```
    MONGODB_URI=<your_mongodb_connection_string>
    NEXTAUTH_SECRET=<your_nextauth_secret>
    NEXTAUTH_URL=<http://localhost:3000>
    GOOGLE_CLIENT_ID=<your_google_client_id>
    GOOGLE_CLIENT_SECRET=<your_google_client_secret>
    RAZORPAY_KEY_ID=<your_razorpay_key_id>
    RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.