-- CreateIndex
CREATE INDEX "Cart_cartId_idx" ON "Cart"("cartId");

-- CreateIndex
CREATE INDEX "CartItem_cartItemId_idx" ON "CartItem"("cartItemId");

-- CreateIndex
CREATE INDEX "Order_orderId_idx" ON "Order"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_orderItemId_idx" ON "OrderItem"("orderItemId");

-- CreateIndex
CREATE INDEX "Product_productId_idx" ON "Product"("productId");

-- CreateIndex
CREATE INDEX "User_userId_idx" ON "User"("userId");
