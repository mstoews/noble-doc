---
title: Manufacturing Schema
date: 2025-05-31
---

Okay, here's a SQL schema for a manufacturing inventory application. This schema aims to cover raw materials, work-in-progress (WIP), finished goods, suppliers, purchase orders, work orders, and inventory movements.

I'll use a generic SQL syntax that should be largely compatible with most RDBMS (like PostgreSQL, MySQL, SQL Server).

```sql
-- -----------------------------------------------------
-- Schema ManufacturingInventory
-- -----------------------------------------------------
-- CREATE SCHEMA IF NOT EXISTS ManufacturingInventory;
-- USE ManufacturingInventory;

-- -----------------------------------------------------
-- Table: ItemCategories
-- Description: To categorize items (e.g., Electronics, Mechanical, Raw Material, Finished Good)
-- -----------------------------------------------------
CREATE TABLE ItemCategories (
    CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryName VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT
);

-- -----------------------------------------------------
-- Table: UnitsOfMeasure
-- Description: Defines units like kg, pcs, liters, meters
-- -----------------------------------------------------
CREATE TABLE UnitsOfMeasure (
    UnitID INT PRIMARY KEY AUTO_INCREMENT,
    UnitCode VARCHAR(10) NOT NULL UNIQUE, -- e.g., 'KG', 'PCS', 'MTR'
    UnitName VARCHAR(50) NOT NULL,
    Description TEXT
);

-- -----------------------------------------------------
-- Table: Items
-- Description: Master list of all items - raw materials, WIP components, finished goods
-- -----------------------------------------------------
CREATE TABLE Items (
    ItemID INT PRIMARY KEY AUTO_INCREMENT,
    ItemSKU VARCHAR(50) NOT NULL UNIQUE, -- Stock Keeping Unit
    ItemName VARCHAR(255) NOT NULL,
    ItemDescription TEXT,
    ItemType ENUM('RawMaterial', 'WIP', 'FinishedGood') NOT NULL,
    CategoryID INT,
    UnitID INT, -- Base unit of measure for this item
    StandardCost DECIMAL(12, 2) DEFAULT 0.00, -- Cost to produce or acquire
    SalesPrice DECIMAL(12, 2) DEFAULT 0.00, -- Only for FinishedGoods
    ReorderLevel INT DEFAULT 0,
    LeadTimeDays INT DEFAULT 0, -- Days to procure or produce
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (CategoryID) REFERENCES ItemCategories(CategoryID),
    FOREIGN KEY (UnitID) REFERENCES UnitsOfMeasure(UnitID)
);
CREATE INDEX idx_items_itemname ON Items(ItemName);

-- -----------------------------------------------------
-- Table: Locations
-- Description: Warehouses, production lines, specific bins, etc.
-- -----------------------------------------------------
CREATE TABLE Locations (
    LocationID INT PRIMARY KEY AUTO_INCREMENT,
    LocationCode VARCHAR(50) NOT NULL UNIQUE,
    LocationName VARCHAR(100) NOT NULL,
    LocationType ENUM('Warehouse', 'ProductionLine', 'StagingArea', 'Quarantine', 'Shipping') NOT NULL,
    AddressLine1 VARCHAR(255),
    City VARCHAR(100),
    Country VARCHAR(100),
    IsActive BOOLEAN DEFAULT TRUE
);

-- -----------------------------------------------------
-- Table: Inventory
-- Description: Current stock levels of items at specific locations, potentially with lot/batch tracking
-- -----------------------------------------------------
CREATE TABLE Inventory (
    InventoryID INT PRIMARY KEY AUTO_INCREMENT,
    ItemID INT NOT NULL,
    LocationID INT NOT NULL,
    LotNumber VARCHAR(50), -- For traceability, can be NULL if not lot-tracked
    SerialNumber VARCHAR(100), -- For unique serialized items, can be NULL
    QuantityOnHand DECIMAL(12, 3) NOT NULL DEFAULT 0.000,
    ExpiryDate DATE, -- For perishable items
    LastStocktakeDate DATETIME,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ItemID) REFERENCES Items(ItemID),
    FOREIGN KEY (LocationID) REFERENCES Locations(LocationID),
    UNIQUE (ItemID, LocationID, LotNumber, SerialNumber) -- Ensures uniqueness of stock record
);
CREATE INDEX idx_inventory_item_location ON Inventory(ItemID, LocationID);

-- -----------------------------------------------------
-- Table: Suppliers
-- -----------------------------------------------------
CREATE TABLE Suppliers (
    SupplierID INT PRIMARY KEY AUTO_INCREMENT,
    SupplierName VARCHAR(255) NOT NULL,
    ContactName VARCHAR(100),
    Email VARCHAR(100),
    Phone VARCHAR(20),
    Address TEXT,
    IsActive BOOLEAN DEFAULT TRUE
);

-- -----------------------------------------------------
-- Table: PurchaseOrders
-- Description: Orders placed with suppliers for raw materials or components
-- -----------------------------------------------------
CREATE TABLE PurchaseOrders (
    PurchaseOrderID INT PRIMARY KEY AUTO_INCREMENT,
    SupplierID INT NOT NULL,
    OrderDate DATE NOT NULL,
    ExpectedDeliveryDate DATE,
    Status ENUM('Draft', 'PendingApproval', 'Approved', 'Ordered', 'PartiallyReceived', 'Received', 'Cancelled') NOT NULL,
    TotalAmount DECIMAL(15, 2) DEFAULT 0.00, -- Can be calculated or stored
    Notes TEXT,
    CreatedByUserID INT, -- Link to a Users table (not defined here for simplicity)
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
    -- FOREIGN KEY (CreatedByUserID) REFERENCES Users(UserID) -- if you have a Users table
);

-- -----------------------------------------------------
-- Table: PurchaseOrderItems
-- Description: Line items within a purchase order
-- -----------------------------------------------------
CREATE TABLE PurchaseOrderItems (
    PurchaseOrderItemID INT PRIMARY KEY AUTO_INCREMENT,
    PurchaseOrderID INT NOT NULL,
    ItemID INT NOT NULL, -- Typically RawMaterial or WIP component
    QuantityOrdered DECIMAL(12, 3) NOT NULL,
    UnitPrice DECIMAL(12, 2) NOT NULL,
    QuantityReceived DECIMAL(12, 3) DEFAULT 0.000,
    ReceivedDate DATE, -- Date of last receipt for this item
    LineTotal DECIMAL(15, 2) AS (QuantityOrdered * UnitPrice) STORED, -- Calculated column

    FOREIGN KEY (PurchaseOrderID) REFERENCES PurchaseOrders(PurchaseOrderID) ON DELETE CASCADE,
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

-- -----------------------------------------------------
-- Table: BillOfMaterials (BOM)
-- Description: Defines the components and quantities required to make a finished good or sub-assembly
-- -----------------------------------------------------
CREATE TABLE BillOfMaterials (
    BOM_ID INT PRIMARY KEY AUTO_INCREMENT,
    ParentItemID INT NOT NULL, -- The item being assembled (FinishedGood or WIP)
    ComponentItemID INT NOT NULL, -- A raw material or sub-assembly
    QuantityRequired DECIMAL(10, 3) NOT NULL,
    UnitID INT, -- Unit of measure for the component in this BOM context
    BOMVersion VARCHAR(20) DEFAULT '1.0', -- For managing changes to BOM
    EffectiveDate DATE,
    IsActive BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (ParentItemID) REFERENCES Items(ItemID),
    FOREIGN KEY (ComponentItemID) REFERENCES Items(ItemID),
    FOREIGN KEY (UnitID) REFERENCES UnitsOfMeasure(UnitID),
    UNIQUE (ParentItemID, ComponentItemID, BOMVersion) -- A component can only appear once per parent's BOM version
);

-- -----------------------------------------------------
-- Table: WorkOrders
-- Description: Authorizes the production of a specific quantity of an item
-- -----------------------------------------------------
CREATE TABLE WorkOrders (
    WorkOrderID INT PRIMARY KEY AUTO_INCREMENT,
    ItemID INT NOT NULL, -- The FinishedGood or WIP item to be produced
    QuantityToProduce DECIMAL(12, 3) NOT NULL,
    QuantityProduced DECIMAL(12, 3) DEFAULT 0.000,
    StartDatePlanned DATE,
    EndDatePlanned DATE,
    StartDateActual DATETIME,
    EndDateActual DATETIME,
    Status ENUM('Planned', 'InProgress', 'Paused', 'Completed', 'Cancelled') NOT NULL,
    BOMVersionUsed VARCHAR(20), -- Reference to the BOM version used for this production run
    AssignedToLocationID INT, -- Production line or area
    Notes TEXT,
    CreatedByUserID INT, -- Link to a Users table
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ItemID) REFERENCES Items(ItemID),
    FOREIGN KEY (AssignedToLocationID) REFERENCES Locations(LocationID)
    -- FOREIGN KEY (CreatedByUserID) REFERENCES Users(UserID) -- if you have a Users table
);

-- -----------------------------------------------------
-- Table: WorkOrderComponentUsage
-- Description: Tracks components consumed for a specific work order
-- -----------------------------------------------------
CREATE TABLE WorkOrderComponentUsage (
    UsageID INT PRIMARY KEY AUTO_INCREMENT,
    WorkOrderID INT NOT NULL,
    ComponentItemID INT NOT NULL,
    SourceLocationID INT, -- Where the component was taken from
    QuantityUsed DECIMAL(12, 3) NOT NULL,
    LotNumberUsed VARCHAR(50), -- If tracking component lots
    UsageDate DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (WorkOrderID) REFERENCES WorkOrders(WorkOrderID) ON DELETE CASCADE,
    FOREIGN KEY (ComponentItemID) REFERENCES Items(ItemID),
    FOREIGN KEY (SourceLocationID) REFERENCES Locations(LocationID)
);

-- -----------------------------------------------------
-- Table: InventoryTransactions
-- Description: Audit log of all inventory movements
-- -----------------------------------------------------
CREATE TABLE InventoryTransactions (
    TransactionID INT PRIMARY KEY AUTO_INCREMENT,
    ItemID INT NOT NULL,
    LocationID INT NOT NULL,
    LotNumber VARCHAR(50), -- If applicable
    SerialNumber VARCHAR(100), -- If applicable
    TransactionType ENUM(
        'PurchaseReceipt',      -- Receiving goods from supplier
        'IssueToProduction',    -- Issuing raw materials to a work order
        'ProductionOutput',     -- Receiving finished goods from a work order
        'SalesShipment',        -- Shipping finished goods to customer
        'StockAdjustment',      -- Manual adjustment (e.g., after stocktake)
        'TransferOut',          -- Moving stock to another location
        'TransferIn',           -- Receiving stock from another location
        'Scrap'                 -- Writing off damaged/unusable stock
    ) NOT NULL,
    QuantityChange DECIMAL(12, 3) NOT NULL, -- Positive for increase, negative for decrease
    TransactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    ReferenceID_PO INT,         -- PurchaseOrderID
    ReferenceID_WO INT,         -- WorkOrderID
    ReferenceID_SO INT,         -- SalesOrderID (if you have a sales module)
    ReferenceID_Transfer INT,   -- A transfer order ID
    Notes TEXT,
    UserID INT,                 -- User performing the transaction (link to Users table)

    FOREIGN KEY (ItemID) REFERENCES Items(ItemID),
    FOREIGN KEY (LocationID) REFERENCES Locations(LocationID),
    FOREIGN KEY (ReferenceID_PO) REFERENCES PurchaseOrders(PurchaseOrderID),
    FOREIGN KEY (ReferenceID_WO) REFERENCES WorkOrders(WorkOrderID)
    -- FOREIGN KEY (UserID) REFERENCES Users(UserID) -- if you have a Users table
);
CREATE INDEX idx_invtrans_item_loc ON InventoryTransactions(ItemID, LocationID);
CREATE INDEX idx_invtrans_transtype ON InventoryTransactions(TransactionType);

-- -----------------------------------------------------
-- (Optional) Table: QualityControlChecks
-- -----------------------------------------------------
CREATE TABLE QualityControlChecks (
    CheckID INT PRIMARY KEY AUTO_INCREMENT,
    ItemID INT NOT NULL,
    WorkOrderID INT, -- If related to production
    PurchaseOrderItemID INT, -- If related to incoming goods
    CheckDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    InspectorUserID INT,
    Status ENUM('Pending', 'Pass', 'Fail', 'Rework') NOT NULL,
    Notes TEXT,
    QuantityChecked DECIMAL(12,3),
    QuantityPassed DECIMAL(12,3),
    QuantityFailed DECIMAL(12,3),

    FOREIGN KEY (ItemID) REFERENCES Items(ItemID),
    FOREIGN KEY (WorkOrderID) REFERENCES WorkOrders(WorkOrderID),
    FOREIGN KEY (PurchaseOrderItemID) REFERENCES PurchaseOrderItems(PurchaseOrderItemID)
    -- FOREIGN KEY (InspectorUserID) REFERENCES Users(UserID)
);

-- -----------------------------------------------------
-- (Optional) Table: Users
-- Description: Users of the application
-- -----------------------------------------------------
-- CREATE TABLE Users (
--     UserID INT PRIMARY KEY AUTO_INCREMENT,
--     Username VARCHAR(50) NOT NULL UNIQUE,
--     PasswordHash VARCHAR(255) NOT NULL,
--     FullName VARCHAR(100),
--     Email VARCHAR(100) UNIQUE,
--     Role VARCHAR(50), -- e.g., 'Admin', 'WarehouseManager', 'ProductionOperator'
--     IsActive BOOLEAN DEFAULT TRUE,
--     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
```

Key Considerations & Explanations:

1.  **`Items`**: Central table for all physical things. `ItemType` distinguishes between Raw Materials, WIP, and Finished Goods.
2.  **`Locations`**: Physical or logical places where inventory can reside.
3.  **`Inventory`**: The core table showing *how much* of *what item* is *where*, potentially with `LotNumber` and `SerialNumber` for traceability. This table represents the current state.
4.  **`Suppliers`, `PurchaseOrders`, `PurchaseOrderItems`**: Manage procurement of raw materials/components.
5.  **`BillOfMaterials (BOM)`**: Crucial for manufacturing. Defines the "recipe" for a product. Note the `BOMVersion` for managing changes.
6.  **`WorkOrders`**: The instruction to produce a certain quantity of an item.
7.  **`WorkOrderComponentUsage`**: Tracks which specific components (and potentially their lots) were used for a work order. This helps in consuming raw material inventory.
8.  **`InventoryTransactions`**: This is the **audit trail**. Every movement of stock (in, out, adjustment) should create a record here. This table is vital for historical reporting, troubleshooting discrepancies, and calculating historical stock levels. `QuantityChange` is positive for additions and negative for subtractions.
9.  **`ItemCategories`, `UnitsOfMeasure`**: Lookup tables for better data organization and consistency.
10. **`QualityControlChecks` (Optional)**: If QC is a significant part of your process.
11. **`Users` (Optional, commented out)**: If you need to track who performed actions.
12. **Primary Keys (`AUTO_INCREMENT` or `IDENTITY`)**: Used for most tables.
13. **Foreign Keys**: Enforce referential integrity. `ON DELETE CASCADE` is used selectively (e.g., deleting a Purchase Order might cascade to delete its items). Be cautious with `ON DELETE CASCADE`.
14. **Indexes**: Added to frequently queried columns (especially foreign keys and columns used in WHERE clauses) to improve performance.
15. **ENUMs**: Used for status fields or types where there's a fixed set of values. MySQL supports `ENUM` directly. For other databases (like PostgreSQL or SQL Server), you might use a `VARCHAR` column with a `CHECK` constraint or a separate lookup table.
16. **Timestamps**: `CreatedAt` and `UpdatedAt` for auditing row changes.
17. **Calculated Column (`LineTotal` in `PurchaseOrderItems`)**: Some RDBMS support this (`GENERATED ALWAYS AS` or `COMPUTED BY`). If not, you'd calculate it in your application or views.

This schema provides a solid foundation. You might need to add more specific fields or tables depending on the exact requirements of your manufacturing company (e.g., machine scheduling, detailed labor tracking, more complex routing, serialized item tracking).
