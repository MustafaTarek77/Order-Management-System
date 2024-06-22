<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Order Management System (OMS) for E-commerce Mobile App

#### Objective:

Design and implement an Order Management System (OMS) for an e-commerce mobile app.

#### Requirements:

- **Environment Setup:**
  - Ensure you have a working environment with the necessary tools and technologies.
  - **Backend Framework:** NestJS
  - **ORM:** Prisma
  - **Database:** PostgreSQL

---

### Database Schema

The database schema for this project is designed using Prisma and PostgreSQL to efficiently manage data for our e-commerce Order Management System (OMS). It consists of interconnected tables representing key entities crucial to the application's functionality.

#### Entities and Relationships:

1. **User:**

   - Represents users of the e-commerce platform.
   - **Fields:**
     - `userId`: Unique identifier for each user.
     - `name`: Full name of the user.
     - `email`: Email address of the user (unique).
     - `password`: Securely hashed password for user authentication.
     - `address`: User's shipping address.

2. **Product:**

   - Represents products available for sale in the e-commerce platform.
   - **Fields:**
     - `productId`: Unique identifier for each product.
     - `name`: Name of the product.
     - `description`: Optional description of the product.
     - `price`: Price of the product.
     - `stock`: Available quantity of the product.

3. **Order:**

   - Represents an order placed by a user.
   - **Fields:**
     - `orderId`: Unique identifier for each order.
     - `orderDate`: Date and time when the order was placed.
     - `status`: Current status of the order (e.g., pending, processing, completed).
     - `total`: Total price of the order.

4. **Cart:**

   - Represents the shopping cart of a user.
   - **Fields:**
     - `cartId`: Unique identifier for each cart.

5. **CartItem:**

   - Represents a specific product added to a user's shopping cart.
   - **Fields:**
     - `cartItemId`: Unique identifier for each cart item.
     - `quantity`: Quantity of the product added to the cart.
     - `price`: Price of the product at the time it was added to the cart.

6. **OrderItem:**
   - Represents a specific product included in an order.
   - **Fields:**
     - `orderItemId`: Unique identifier for each order item.
     - `quantity`: Quantity of the product included in the order.
     - `price`: Price of the product at the time the order was placed.

#### Explanation:

- **Purpose:** This schema is designed to support essential functionalities such as user management, product catalog management, shopping cart operations, order processing, and order tracking.
- **Data Integrity:** Utilizes Prisma's capabilities to enforce data integrity through constraints such as unique email addresses for users and proper relationships between entities (e.g., each order item belongs to one specific order).
- **Scalability:** The schema is structured to scale efficiently with the growth of the application, ensuring optimal performance and reliability.
- **Flexibility:** Allows for easy modifications and expansions to accommodate future features or business requirements.

#### Implementation:

To implement this schema in your development environment:

1. **Setup Prisma:** Ensure Prisma CLI is installed and configured with your PostgreSQL database URL.
2. **Migrate Schema:** Run migrations using `npx prisma migrate dev` to create or update the database schema based on your Prisma schema file.

3. **Environment Variables:** Set up environment variables for database connection details and other configuration settings required by your application.

---

### API Endpoints:

- **Add to Cart:**

  - **Endpoint:** POST /api/cart/add
  - **Functionality:** Adds a product to the user's cart or updates the quantity if the product is already in the cart.

- **View Cart:**

  - **Endpoint:** GET /api/cart/:userId
  - **Functionality:** Retrieves the user's cart.

- **Update Cart:**

  - **Endpoint:** PUT /api/cart/update
  - **Functionality:** Updates the quantity of a product in the cart.

- **Remove From Cart:**

  - **Endpoint:** DELETE /api/cart/remove
  - **Functionality:** Removes a product from the cart.

- **Create Order:**

  - **Endpoint:** POST /api/orders
  - **Functionality:** Creates a new order for the specified user with the products in their cart.

- **Get Order by ID:**

  - **Endpoint:** GET /api/orders/:orderId
  - **Functionality:** Retrieves the order details by order ID.

- **Update Order Status:**

  - **Endpoint:** PUT /api/orders/:orderId/status
  - **Functionality:** Updates the status of an order.

- **Order History Retrieval:**

  - **Endpoint:** GET /api/users/:userId/orders
  - **Functionality:** Retrieves order history for a user.

- **Apply Coupon:**
  - **Endpoint:** POST /api/orders/apply-coupon
  - **Functionality:** Applying discounts and coupons to orders.

### Getting Started:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file based on `.env.example` and configure your PostgreSQL database URL.
4. **Run the application:**

   ```bash
   # development
   $ npm run start

   # watch mode
   $ npm run start:dev

   # production mode
   $ npm run start:prod
   ```

5. **Testing:**

   ```bash
   # unit tests
   $ npm run test

   # e2e tests
   $ npm run test:e2e

   # test coverage
   $ npm run test:cov
   ```

### Notes:

- Ensure PostgreSQL is running and accessible.
- Modify the Prisma schema (`schema.prisma`) as needed and run `npx prisma migrate dev` to apply migrations.
- Customize NestJS controllers and services (`src/` folder) to fit additional business logic requirements.
