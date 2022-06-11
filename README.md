# eCommerce
eCommerce Website For the Product
# Project Team
- Jaison Jacob 
- Elom Essan

# Purpose 
This project is create eCommerce website for different category of technology products
# Scope
- Home page with the listing of products
- Customer Authentication
- Customer Payment Solution of Purchased Products
- Customer Order History

# Routes
### Products
/products
GET
Show all the products
products > products-list
/products/create
GET
Show a form to create a product (only admin)
products > add-product
/products/create
POST
Creating the product in the database
products > add-product
/products/id/edit
GET
retrieving  the product from the database
products > edit -product
/products/id/edit
POST
Updating the product in  the database
products > edit -product
/products/id/delete
POST
Delete the product in the database
products > edit -product

Route
### Shopping Cart
/
GET
Show all the products
products
/add-to-cart/:id
POST
Adding the product into the cart
Create an Order with the productId and userId..
Add to cart
/add-to-cart/:id/edit
GET
Show the product to be edited
Add to cart
/add-to-cart/:id/edit
POST
Edit product quantity in the cart
Edit a product
/add-to-cart/:id/delete
POST
Deleting a product into the cart
Delete a product
/cart
GET
List all the products in the cart

### Checkout Process
/checkout
GET
Show all the selected products by the customer
checkout
/payment
GET
View the payment form
payment
/payment
POST
Process the payment
payment














