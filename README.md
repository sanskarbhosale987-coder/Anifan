anifans-admin/
├── pages/
│   ├── admin.js                  # The Admin Login page component.
│   ├── admin/
│   │   ├── dashboard.js         # The main Admin Dashboard UI after successful login.
│   │   └── api/
│   │       ├── auth.js          # API Route: Handles admin login and token verification.
│   │       ├── upload.js        # API Route: Manages video and thumbnail file uploads.
│   │       ├── content.js       # API Route: Handles getting/editing website text content.
│   │       └── mirrors.js       # API Route: Manages adding mirror links to episodes.
│   ├── _app.js                   # (Optional) Global App component for styles.
│   └── index.js                  # The main homepage of the AniFans website.
│
├── public/
│   ├── uploads/                  # Directory where uploaded videos & images are stored.
│   └── admin-styles.css          # (If used) Custom CSS for the Admin Panel.
│
├── lib/
│   ├── auth.js                   # Middleware/helper for protecting API routes.
│   └── storage.js                # In-memory JSON "database" for storing data.
│
├── package.json                  # Project dependencies and scripts.
├── tailwind.config.js            # Configuration for Tailwind CSS.
└── README.md                     # This documentation file.
