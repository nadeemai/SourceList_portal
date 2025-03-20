sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], function (Controller, JSONModel, MessageBox, MessageToast, Filter, FilterOperator, Sorter) {
    "use strict";

    return Controller.extend("com.tableentry.tablestructure.controller.Table_Entry", {
        onInit: function () {
            var oData = {
                items: [
                    { supplierRequestId: "R00000019", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "SUPPLIER", status: "PENDING" },
                    { supplierRequestId: "R00000018", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "SUPPLIER", status: "PENDING" },
                    { supplierRequestId: "R00000017", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "DRAFT" },
                    { supplierRequestId: "R00000016", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "CANCELLED" },
                    { supplierRequestId: "R00000015", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "ON BOARDING", status: "VENDOR CREATED" },
                    { supplierRequestId: "R00000014", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "ON BOARDING", status: "CMDM UPDATE PENDING" },
                    { supplierRequestId: "R00000013", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "ON BOARDING", status: "FINANCE UPDATE PENDING" },
                    { supplierRequestId: "R00000012", supplierName: "ABC Pvt Ltd", type: "Indirect", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "ON BOARDING", status: "PURCHASE APPROVAL PENDING" },
                    { supplierRequestId: "R00000011", supplierName: "ABC Pvt Ltd", type: "Indirect", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "DRAFT" },
                    { supplierRequestId: "R00000010", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "APPROVED" },
                    { supplierRequestId: "R00000009", supplierName: "XYZ Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "DRAFT" }
                ],
                draftCount: 0,
                myPendingCount: 0,
                pendingWithSupplierCount: 0,
                onBoardingCount: 0,
                allCount: 0
            };

            this._bDescendingSort = false;
            this._sCurrentSortField = "supplierRequestId";

            this._updateTileCounts(oData);
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "products");
        },

        _updateTileCounts: function (oData) {
            var aItems = oData.items;
            oData.draftCount = aItems.filter(item => item.status === "DRAFT").length;
            oData.myPendingCount = aItems.filter(item => item.stage === "BUYER").length;
            oData.pendingWithSupplierCount = aItems.filter(item => item.stage === "SUPPLIER").length;
            oData.onBoardingCount = aItems.filter(item => item.stage === "ON BOARDING").length;
            oData.allCount = aItems.length;
        },

        _applyFilters: function () {
            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            // Supplier ID Filter
            var sSupplierId = this.byId("supplierIdInput").getValue();
            if (sSupplierId) {
                aFilters.push(new Filter("supplierRequestId", FilterOperator.Contains, sSupplierId));
            }

            // Supplier Type Filter
            var sSupplierType = this.byId("supplierTypeComboBox").getSelectedKey();
            if (sSupplierType && sSupplierType !== "All") {
                aFilters.push(new Filter("type", FilterOperator.EQ, sSupplierType));
            }

            // Stage Filter
            var sStage = this.byId("stageComboBox").getSelectedKey();
            if (sStage && sStage !== "All") {
                aFilters.push(new Filter("stage", FilterOperator.EQ, sStage));
            }

            // Status Filter
            var sStatus = this.byId("statusComboBox").getSelectedKey();
            if (sStatus && sStatus !== "All") {
                aFilters.push(new Filter("status", FilterOperator.EQ, sStatus));
            }

            // Apply combined filters
            if (aFilters.length > 0) {
                oBinding.filter(new Filter({
                    filters: aFilters,
                    and: true
                }));
            } else {
                oBinding.filter([]);
            }
        },

        onSupplierIdChange: function (oEvent) {
            this._applyFilters();
        },

        onSupplierTypeChange: function (oEvent) {
            this._applyFilters();
        },

        onStageChange: function (oEvent) {
            this._applyFilters();
        },

        onStatusChange: function (oEvent) {
            this._applyFilters();
        },

        onSort: function () {
            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");
            this._bDescendingSort = !this._bDescendingSort;

            var oSorter = new Sorter({
                path: this._sCurrentSortField,
                descending: this._bDescendingSort
            });

            oBinding.sort(oSorter);
            MessageToast.show(`Sorted by ${this._sCurrentSortField} ${this._bDescendingSort ? "Descending" : "Ascending"}`);
        },

        onTilePress: function (oEvent) {
            var oTile = oEvent.getSource();
            var sTileId = oTile.getId();
            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            if (sTileId.includes("draftTile")) {
                aFilters.push(new Filter("status", FilterOperator.EQ, "DRAFT"));
            } else if (sTileId.includes("myPendingTile")) {
                aFilters.push(new Filter("stage", FilterOperator.EQ, "BUYER"));
            } else if (sTileId.includes("pendingWithSupplierTile")) {
                aFilters.push(new Filter("stage", FilterOperator.EQ, "SUPPLIER"));
            } else if (sTileId.includes("onBoardingTile")) {
                aFilters.push(new Filter("stage", FilterOperator.EQ, "ON BOARDING"));
            } else if (sTileId.includes("allTile")) {
                oBinding.filter([]);
                this.byId("supplierIdInput").setValue("");
                this.byId("supplierTypeComboBox").setSelectedKey("All");
                this.byId("stageComboBox").setSelectedKey("All");
                this.byId("statusComboBox").setSelectedKey("All");
                return;
            }

            oBinding.filter(aFilters);
            // Reset other filters when a tile is pressed
            this.byId("supplierIdInput").setValue("");
            this.byId("supplierTypeComboBox").setSelectedKey("All");
            this.byId("stageComboBox").setSelectedKey("All");
            this.byId("statusComboBox").setSelectedKey("All");
        },

        onOrderPress: function () {
            // Get the current model
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();

            // Generate a new supplier request ID (increment the last ID)
            var aItems = oData.items;
            var iLastId = parseInt(aItems[0].supplierRequestId.replace("R", ""), 10);
            var sNewId = "R" + (iLastId + 1).toString().padStart(8, "0");

            // Get the current date for requestCreationDate and lastActionDate
            var oDate = new Date();
            var sCurrentDate = oDate.getDate() + "-" + (oDate.getMonth() + 1) + "-" + oDate.getFullYear();

            // Create a new supplier request
            var oNewSupplier = {
                supplierRequestId: sNewId,
                supplierName: "New Supplier " + sNewId, // Example name
                type: "Direct", // Default type
                requestCreationDate: sCurrentDate,
                requestAging: "0 Days", // New request, so aging is 0
                lastActionDate: sCurrentDate,
                lastActionAging: "0 Days", // New request, so aging is 0
                stage: "SUPPLIER", // Default stage
                status: "DRAFT" // Default status
            };

            // Add the new supplier to the items array
            aItems.unshift(oNewSupplier); // Add to the beginning of the array

            // Update tile counts
            this._updateTileCounts(oData);

            // Update the model
            oModel.setData(oData);

            // Refresh the table binding to reflect the new data
            var oTable = this.byId("productsTable");
            oTable.getBinding("items").refresh();

            MessageToast.show("New Supplier Request created successfully! ID: " + sNewId);
        },

        onClearPress: function () {
            // Reset all filter inputs
            this.byId("supplierIdInput").setValue("");
            this.byId("supplierTypeComboBox").setSelectedKey("All");
            this.byId("stageComboBox").setSelectedKey("All");
            this.byId("statusComboBox").setSelectedKey("All");

            // Clear table filters
            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter([]);

            MessageToast.show("Filters cleared!");
        }
    });
});



// TABLE UPDATED LIST 1

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], function (Controller, JSONModel, MessageBox, MessageToast, Filter, FilterOperator, Sorter) {
    "use strict";

    return Controller.extend("com.tableentry.tablestructure.controller.Table_Entry", {
        onInit: function () {
            var oData = {
                items: [
                    { supplierRequestId: "R00000019", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "SUPPLIER", status: "PENDING" },
                    { supplierRequestId: "R00000018", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "SUPPLIER", status: "PENDING" },
                    { supplierRequestId: "R00000017", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "DRAFT" },
                    { supplierRequestId: "R00000016", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "CANCELLED" },
                    { supplierRequestId: "R00000015", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "ON BOARDING", status: "VENDOR CREATED" },
                    { supplierRequestId: "R00000014", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "ON BOARDING", status: "CMDM UPDATE PENDING" },
                    { supplierRequestId: "R00000013", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "ON BOARDING", status: "FINANCE UPDATE PENDING" },
                    { supplierRequestId: "R00000012", supplierName: "ABC Pvt Ltd", type: "Indirect", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "ON BOARDING", status: "PURCHASE APPROVAL PENDING" },
                    { supplierRequestId: "R00000011", supplierName: "ABC Pvt Ltd", type: "Indirect", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "DRAFT" },
                    { supplierRequestId: "R00000010", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "APPROVED" },
                    { supplierRequestId: "R00000009", supplierName: "XYZ Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "DRAFT" }
                ],
                draftCount: 0,
                myPendingCount: 0,
                pendingWithSupplierCount: 0,
                onBoardingCount: 0,
                allCount: 0
            };

            this._bDescendingSort = false;
            this._sCurrentSortField = "supplierRequestId";

            this._updateTileCounts(oData);
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "products");
        },

        _updateTileCounts: function (oData) {
            var aItems = oData.items;
            oData.draftCount = aItems.filter(item => item.status === "DRAFT").length;
            oData.myPendingCount = aItems.filter(item => item.stage === "BUYER").length;
            oData.pendingWithSupplierCount = aItems.filter(item => item.stage === "SUPPLIER").length;
            oData.onBoardingCount = aItems.filter(item => item.stage === "ON BOARDING").length;
            oData.allCount = aItems.length;
        },

        _applyFilters: function () {
            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            // Supplier ID Filter
            var sSupplierId = this.byId("supplierIdInput").getValue();
            if (sSupplierId) {
                aFilters.push(new Filter("supplierRequestId", FilterOperator.Contains, sSupplierId));
            }

            // Supplier Type Filter
            var sSupplierType = this.byId("supplierTypeComboBox").getSelectedKey();
            if (sSupplierType && sSupplierType !== "All") {
                aFilters.push(new Filter("type", FilterOperator.EQ, sSupplierType));
            }

            // Stage Filter
            var sStage = this.byId("stageComboBox").getSelectedKey();
            if (sStage && sStage !== "All") {
                aFilters.push(new Filter("stage", FilterOperator.EQ, sStage));
            }

            // Status Filter
            var sStatus = this.byId("statusComboBox").getSelectedKey();
            if (sStatus && sStatus !== "All") {
                aFilters.push(new Filter("status", FilterOperator.EQ, sStatus));
            }

            // Apply combined filters
            if (aFilters.length > 0) {
                oBinding.filter(new Filter({
                    filters: aFilters,
                    and: true
                }));
            } else {
                oBinding.filter([]);
            }
        },

        onSupplierIdChange: function (oEvent) {
            this._applyFilters();
        },

        onSupplierTypeChange: function (oEvent) {
            this._applyFilters();
        },

        onStageChange: function (oEvent) {
            this._applyFilters();
        },

        onStatusChange: function (oEvent) {
            this._applyFilters();
        },

        onSort: function () {
            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");
            this._bDescendingSort = !this._bDescendingSort;

            var oSorter = new Sorter({
                path: this._sCurrentSortField,
                descending: this._bDescendingSort
            });

            oBinding.sort(oSorter);
            MessageToast.show(`Sorted by ${this._sCurrentSortField} ${this._bDescendingSort ? "Descending" : "Ascending"}`);
        },

        onTilePress: function (oEvent) {
            var oTile = oEvent.getSource();
            var sTileId = oTile.getId();
            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            if (sTileId.includes("draftTile")) {
                aFilters.push(new Filter("status", FilterOperator.EQ, "DRAFT"));
            } else if (sTileId.includes("myPendingTile")) {
                aFilters.push(new Filter("stage", FilterOperator.EQ, "BUYER"));
            } else if (sTileId.includes("pendingWithSupplierTile")) {
                aFilters.push(new Filter("stage", FilterOperator.EQ, "SUPPLIER"));
            } else if (sTileId.includes("onBoardingTile")) {
                aFilters.push(new Filter("stage", FilterOperator.EQ, "ON BOARDING"));
            } else if (sTileId.includes("allTile")) {
                oBinding.filter([]);
                this.byId("supplierIdInput").setValue("");
                this.byId("supplierTypeComboBox").setSelectedKey("All");
                this.byId("stageComboBox").setSelectedKey("All");
                this.byId("statusComboBox").setSelectedKey("All");
                return;
            }

            oBinding.filter(aFilters);
            // Reset other filters when a tile is pressed
            this.byId("supplierIdInput").setValue("");
            this.byId("supplierTypeComboBox").setSelectedKey("All");
            this.byId("stageComboBox").setSelectedKey("All");
            this.byId("statusComboBox").setSelectedKey("All");
        },

        onTableSelectionChange: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext("products");
                var oData = oContext.getObject();
                var oDetailLayout = this.byId("detailLayout");

                oDetailLayout.removeAllContent();
                oDetailLayout.addContent(new sap.m.Text({ text: "Supplier Request ID: " + oData.supplierRequestId }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Supplier Name: " + oData.supplierName }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Type: " + oData.type }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Request Creation Date: " + oData.requestCreationDate }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Request Aging: " + oData.requestAging }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Last Action Date: " + oData.lastActionDate }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Last Action Aging: " + oData.lastActionAging }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Stage: " + oData.stage }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Status: " + oData.status }));

                this.byId("flexibleColumnLayout").setLayout("TwoColumnsMidExpanded");
            }
        },

        onOrderPress: function () {
            // Get the current model data
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            // Generate a new supplier request ID (increment the last ID)
            var iLastId = parseInt(aItems[0].supplierRequestId.replace("R", ""), 10);
            var sNewId = "R" + (iLastId + 1).toString().padStart(8, "0");

            // Get today's date in the format DD-MM-YYYY
            var oDate = new Date();
            var sToday = oDate.getDate().toString().padStart(2, "0") + "-" + 
                        (oDate.getMonth() + 1).toString().padStart(2, "0") + "-" + 
                        oDate.getFullYear();

            // Create a new supplier request
            var oNewSupplier = {
                supplierRequestId: sNewId,
                supplierName: "New Supplier " + sNewId, // Example name
                type: "Direct", // Default type
                requestCreationDate: sToday,
                requestAging: "0 Days", // New request, so aging is 0
                lastActionDate: sToday,
                lastActionAging: "0 Days", // New request, so aging is 0
                stage: "SUPPLIER", // Default stage
                status: "DRAFT" // Default status
            };

            // Add the new supplier to the items array
            aItems.unshift(oNewSupplier); // Add to the beginning of the array

            // Update the tile counts
            this._updateTileCounts(oData);

            // Update the model
            oModel.setData(oData);

            // Refresh the table binding to reflect the new data
            var oTable = this.byId("productsTable");
            oTable.getBinding("items").refresh();

            // Show a success message
            MessageToast.show("New Supplier Request " + sNewId + " created successfully!");
        },

        onClearPress: function () {
            // Reset all filter inputs
            this.byId("supplierIdInput").setValue("");
            this.byId("supplierTypeComboBox").setSelectedKey("All");
            this.byId("stageComboBox").setSelectedKey("All");
            this.byId("statusComboBox").setSelectedKey("All");

            // Clear table filters
            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter([]);

            MessageToast.show("Filters cleared!");
        }
    });
});
















// TABLE UPADETD LIST

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], function (Controller, JSONModel, MessageBox, MessageToast, Filter, FilterOperator, Sorter) {
    "use strict";

    return Controller.extend("com.tableentry.tablestructure.controller.Table_Entry", {
        onInit: function () {
            var oData = {
                items: [
                    { supplierRequestId: "R00000019", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "SUPPLIER", status: "PENDING" },
                    { supplierRequestId: "R00000018", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "SUPPLIER", status: "PENDING" },
                    { supplierRequestId: "R00000017", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "DRAFT" },
                    { supplierRequestId: "R00000016", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "CANCELLED" },
                    { supplierRequestId: "R00000015", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "ON BOARDING", status: "VENDOR CREATED" },
                    { supplierRequestId: "R00000014", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "ON BOARDING", status: "CMDM UPDATE PENDING" },
                    { supplierRequestId: "R00000013", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "ON BOARDING", status: "FINANCE UPDATE PENDING" },
                    { supplierRequestId: "R00000012", supplierName: "ABC Pvt Ltd", type: "Indirect", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "ON BOARDING", status: "PURCHASE APPROVAL PENDING" },
                    { supplierRequestId: "R00000011", supplierName: "ABC Pvt Ltd", type: "Indirect", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "DRAFT" },
                    { supplierRequestId: "R00000010", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "APPROVED" },
                    { supplierRequestId: "R00000009", supplierName: "XYZ Pvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "10 Days", lastActionDate: "13-10-2024", lastActionAging: "15 Days", stage: "BUYER", status: "DRAFT" }
                ],
                draftCount: 0,
                myPendingCount: 0,
                pendingWithSupplierCount: 0,
                onBoardingCount: 0,
                allCount: 0
            };

            this._bDescendingSort = false;
            this._sCurrentSortField = "supplierRequestId";

            this._updateTileCounts(oData);
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "products");
        },

        _updateTileCounts: function (oData) {
            var aItems = oData.items;
            oData.draftCount = aItems.filter(item => item.status === "DRAFT").length;
            oData.myPendingCount = aItems.filter(item => item.stage === "BUYER").length;
            oData.pendingWithSupplierCount = aItems.filter(item => item.stage === "SUPPLIER").length;
            oData.onBoardingCount = aItems.filter(item => item.stage === "ON BOARDING").length;
            oData.allCount = aItems.length;
        },

        _applyFilters: function () {
            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            // Supplier ID Filter
            var sSupplierId = this.byId("supplierIdInput").getValue();
            if (sSupplierId) {
                aFilters.push(new Filter("supplierRequestId", FilterOperator.Contains, sSupplierId));
            }

            // Supplier Type Filter
            var sSupplierType = this.byId("supplierTypeComboBox").getSelectedKey();
            if (sSupplierType && sSupplierType !== "All") {
                aFilters.push(new Filter("type", FilterOperator.EQ, sSupplierType));
            }

            // Stage Filter
            var sStage = this.byId("stageComboBox").getSelectedKey();
            if (sStage && sStage !== "All") {
                aFilters.push(new Filter("stage", FilterOperator.EQ, sStage));
            }

            // Status Filter
            var sStatus = this.byId("statusComboBox").getSelectedKey();
            if (sStatus && sStatus !== "All") {
                aFilters.push(new Filter("status", FilterOperator.EQ, sStatus));
            }

            // Apply combined filters
            if (aFilters.length > 0) {
                oBinding.filter(new Filter({
                    filters: aFilters,
                    and: true
                }));
            } else {
                oBinding.filter([]);
            }
        },

        onSupplierIdChange: function (oEvent) {
            this._applyFilters();
        },

        onSupplierTypeChange: function (oEvent) {
            this._applyFilters();
        },

        onStageChange: function (oEvent) {
            this._applyFilters();
        },

        onStatusChange: function (oEvent) {
            this._applyFilters();
        },

        onSort: function () {
            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");
            this._bDescendingSort = !this._bDescendingSort;

            var oSorter = new Sorter({
                path: this._sCurrentSortField,
                descending: this._bDescendingSort
            });

            oBinding.sort(oSorter);
            MessageToast.show(`Sorted by ${this._sCurrentSortField} ${this._bDescendingSort ? "Descending" : "Ascending"}`);
        },

        onTilePress: function (oEvent) {
            var oTile = oEvent.getSource();
            var sTileId = oTile.getId();
            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            if (sTileId.includes("draftTile")) {
                aFilters.push(new Filter("status", FilterOperator.EQ, "DRAFT"));
            } else if (sTileId.includes("myPendingTile")) {
                aFilters.push(new Filter("stage", FilterOperator.EQ, "BUYER"));
            } else if (sTileId.includes("pendingWithSupplierTile")) {
                aFilters.push(new Filter("stage", FilterOperator.EQ, "SUPPLIER"));
            } else if (sTileId.includes("onBoardingTile")) {
                aFilters.push(new Filter("stage", FilterOperator.EQ, "ON BOARDING"));
            } else if (sTileId.includes("allTile")) {
                oBinding.filter([]);
                this.byId("supplierIdInput").setValue("");
                this.byId("supplierTypeComboBox").setSelectedKey("All");
                this.byId("stageComboBox").setSelectedKey("All");
                this.byId("statusComboBox").setSelectedKey("All");
                return;
            }

            oBinding.filter(aFilters);
            // Reset other filters when a tile is pressed
            this.byId("supplierIdInput").setValue("");
            this.byId("supplierTypeComboBox").setSelectedKey("All");
            this.byId("stageComboBox").setSelectedKey("All");
            this.byId("statusComboBox").setSelectedKey("All");
        },

        onTableSelectionChange: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext("products");
                var oData = oContext.getObject();
                var oDetailLayout = this.byId("detailLayout");

                oDetailLayout.removeAllContent();
                oDetailLayout.addContent(new sap.m.Text({ text: "Supplier Request ID: " + oData.supplierRequestId }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Supplier Name: " + oData.supplierName }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Type: " + oData.type }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Request Creation Date: " + oData.requestCreationDate }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Request Aging: " + oData.requestAging }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Last Action Date: " + oData.lastActionDate }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Last Action Aging: " + oData.lastActionAging }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Stage: " + oData.stage }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Status: " + oData.status }));

                this.byId("flexibleColumnLayout").setLayout("TwoColumnsMidExpanded");
            }
        },

        onOrderPress: function () {
            MessageToast.show("New Supplier Request created successfully!");
        }
    });
});









