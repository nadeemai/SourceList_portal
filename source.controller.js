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
                    { supplierRequestId: "R00000019", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-01-2024", requestAging: "10 Days", lastActionDate: "11-10-2024", lastActionAging: "15 Days", stage: "SUPPLIER", status: "PENDING" },
                    { supplierRequestId: "R00000018", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "12-02-2024", requestAging: "20 Days", lastActionDate: "12-10-2024", lastActionAging: "20 Days", stage: "SUPPLIER", status: "PENDING" },
                    { supplierRequestId: "R00000017", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-03-2024", requestAging: "30 Days", lastActionDate: "13-10-2024", lastActionAging: "30 Days", stage: "BUYER", status: "DRAFT" },
                    { supplierRequestId: "R00000016", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "12-04-2024", requestAging: "40 Days", lastActionDate: "14-10-2024", lastActionAging: "40 Days", stage: "BUYER", status: "CANCELLED" },
                    { supplierRequestId: "R00000015", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-05-2024", requestAging: "50 Days", lastActionDate: "15-10-2024", lastActionAging: "50 Days", stage: "ON BOARDING", status: "VENDOR CREATED" },
                    { supplierRequestId: "R00000014", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-06-2024", requestAging: "60 Days", lastActionDate: "16-10-2024", lastActionAging: "25 Days", stage: "ON BOARDING", status: "CMDM UPDATE PENDING" },
                    { supplierRequestId: "R00000013", supplierName: "ABC Pvt Ltd", type: "Indirect", requestCreationDate: "12-07-2024", requestAging: "70 Days", lastActionDate: "17-10-2024", lastActionAging: "35 Days", stage: "ON BOARDING", status: "FINANCE UPDATE PENDING" },
                    { supplierRequestId: "R00000012", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "12-08-2024", requestAging: "80 Days", lastActionDate: "18-10-2024", lastActionAging: "55 Days", stage: "ON BOARDING", status: "PURCHASE APPROVAL PENDING" },
                    { supplierRequestId: "R00000011", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "12-109-2024", requestAging: "90 Days", lastActionDate: "19-10-2024", lastActionAging: "45 Days", stage: "BUYER", status: "DRAFT" },
                    { supplierRequestId: "R00000010", supplierName: "XYZPvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "100 Days", lastActionDate: "20-10-2024", lastActionAging: "75 Days", stage: "BUYER", status: "APPROVED" },
                    { supplierRequestId: "R00000009", supplierName: "XYZ Pvt Ltd", type: "Direct", requestCreationDate: "12-11-2024", requestAging: "110 Days", lastActionDate: "21-10-2024", lastActionAging: "65 Days", stage: "BUYER", status: "DRAFT" }

                ],
                draftCount: 0,
                myPendingCount: 0,
                pendingWithSupplierCount: 0,
                onBoardingCount: 0,
                allCount: 0
            };

            this._sortStates = {}; // Object to track sort state for each column
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

            var sSupplierId = this.byId("supplierIdInput").getValue();
            if (sSupplierId) {
                aFilters.push(new Filter("supplierRequestId", FilterOperator.Contains, sSupplierId));
            }

            var sSupplierType = this.byId("supplierTypeComboBox").getSelectedKey();
            if (sSupplierType && sSupplierType !== "All") {
                aFilters.push(new Filter("type", FilterOperator.EQ, sSupplierType));
            }

            var sStage = this.byId("stageComboBox").getSelectedKey();
            if (sStage && sStage !== "All") {
                aFilters.push(new Filter("stage", FilterOperator.EQ, sStage));
            }

            var sStatus = this.byId("statusComboBox").getSelectedKey();
            if (sStatus && sStatus !== "All") {
                aFilters.push(new Filter("status", FilterOperator.EQ, sStatus));
            }

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

        onSortColumn: function (oEvent) {
            var oButton = oEvent.getSource();
            var sSortField = oButton.data("sortField");
            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");

            this._sortStates[sSortField] = !this._sortStates[sSortField];
            var bDescending = this._sortStates[sSortField];

            var oSorter = new Sorter({
                path: sSortField,
                descending: bDescending,
                comparator: (sSortField === "requestAging" || sSortField === "lastActionAging") ? this._agingComparator : null
            });

            oBinding.sort(oSorter);
            MessageToast.show(`Sorted by ${sSortField} ${bDescending ? "Descending" : "Ascending"}`);
        },

        _agingComparator: function (a, b) {
            var aDays = parseInt(a.split(" ")[0], 10) || 0;
            var bDays = parseInt(b.split(" ")[0], 10) || 0;
            return aDays - bDays;
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
            this.byId("supplierIdInput").setValue("");
            this.byId("supplierTypeComboBox").setSelectedKey("All");
            this.byId("stageComboBox").setSelectedKey("All");
            this.byId("statusComboBox").setSelectedKey("All");
        },

        onOrderPress: function () {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();

            var aItems = oData.items;
            var iLastId = parseInt(aItems[0].supplierRequestId.replace("R", ""), 10);
            var sNewId = "R" + (iLastId + 1).toString().padStart(8, "0");

            var oDate = new Date();
            var sCurrentDate = oDate.getDate() + "-" + (oDate.getMonth() + 1) + "-" + oDate.getFullYear();

            var oNewSupplier = {
                supplierRequestId: sNewId,
                supplierName: "New Supplier " + sNewId,
                type: "Direct",
                requestCreationDate: sCurrentDate,
                requestAging: "0 Days",
                lastActionDate: sCurrentDate,
                lastActionAging: "0 Days",
                stage: "SUPPLIER",
                status: "DRAFT"
            };

            aItems.unshift(oNewSupplier);
            this._updateTileCounts(oData);
            oModel.setData(oData);

            var oTable = this.byId("productsTable");
            oTable.getBinding("items").refresh();

            MessageToast.show("New Supplier Request created successfully! ID: " + sNewId);
        },

        onClearPress: function () {
            this.byId("supplierIdInput").setValue("");
            this.byId("supplierTypeComboBox").setSelectedKey("All");
            this.byId("stageComboBox").setSelectedKey("All");
            this.byId("statusComboBox").setSelectedKey("All");

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









