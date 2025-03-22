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
                    { supplierRequestId: "R35", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-01-2024", requestAging: "10 Days", lastActionDate: "11-10-2024", lastActionAging: "15 Days", stage: "SUPPLIER", status: "PENDING" },
                    { supplierRequestId: "R18", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "12-02-2024", requestAging: "20 Days", lastActionDate: "12-10-2024", lastActionAging: "20 Days", stage: "SUPPLIER", status: "PENDING" },
                    { supplierRequestId: "R17", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-03-2024", requestAging: "30 Days", lastActionDate: "13-10-2024", lastActionAging: "30 Days", stage: "BUYER", status: "DRAFT" },
                    { supplierRequestId: "R16", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "12-04-2024", requestAging: "40 Days", lastActionDate: "14-10-2024", lastActionAging: "40 Days", stage: "BUYER", status: "CANCELLED" },
                    { supplierRequestId: "R16", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "12-04-2024", requestAging: "40 Days", lastActionDate: "14-10-2024", lastActionAging: "40 Days", stage: "BUYER", status: "CANCELLED" },
                    { supplierRequestId: "R15", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-05-2024", requestAging: "50 Days", lastActionDate: "15-10-2024", lastActionAging: "50 Days", stage: "ON BOARDING", status: "VENDOR CREATED" },
                    { supplierRequestId: "R14", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "12-06-2024", requestAging: "60 Days", lastActionDate: "16-10-2024", lastActionAging: "25 Days", stage: "ON BOARDING", status: "CMDM UPDATE PENDING" },
                    { supplierRequestId: "R13", supplierName: "ABC Pvt Ltd", type: "Indirect", requestCreationDate: "12-07-2024", requestAging: "70 Days", lastActionDate: "17-10-2024", lastActionAging: "35 Days", stage: "ON BOARDING", status: "FINANCE UPDATE PENDING" },
                    { supplierRequestId: "R12", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "12-08-2024", requestAging: "80 Days", lastActionDate: "18-10-2024", lastActionAging: "55 Days", stage: "ON BOARDING", status: "PURCHASE APPROVAL PENDING" },
                    { supplierRequestId: "R11", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "12-109-2024", requestAging: "90 Days", lastActionDate: "19-10-2024", lastActionAging: "45 Days", stage: "BUYER", status: "DRAFT" },
                    { supplierRequestId: "R13", supplierName: "XYZPvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "100 Days", lastActionDate: "20-10-2024", lastActionAging: "75 Days", stage: "BUYER", status: "APPROVED" },
                    { supplierRequestId: "R10", supplierName: "XYZPvt Ltd", type: "Direct", requestCreationDate: "12-10-2024", requestAging: "100 Days", lastActionDate: "20-10-2024", lastActionAging: "75 Days", stage: "BUYER", status: "APPROVED" },
                    { supplierRequestId: "R9", supplierName: "XYZ Pvt Ltd", type: "Direct", requestCreationDate: "12-11-2024", requestAging: "110 Days", lastActionDate: "21-10-2024", lastActionAging: "65 Days", stage: "BUYER", status: "DRAFT" }
                ],
                draftCount: 0,
                myPendingCount: 0,
                pendingWithSupplierCount: 0,
                onBoardingCount: 0,
                allCount: 0
            };

            this._sortStates = {
                supplierRequestId: false,
                supplierName: false,
                type: false,
                requestCreationDate: false,
                requestAging: false,
                lastActionDate: false,
                lastActionAging: false,
                stage: false,
                status: false
            };
            this._originalItems = JSON.parse(JSON.stringify(oData.items));
            this._updateTileCounts(oData);
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "products");

            this._addCustomCSS();
        },

        _addCustomCSS: function () {
            var sStyle = `
                .centeredGrid {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .tileLayout {
                    min-width: 150px;
                    text-align: center;
                }
                #_IDGenToolbar {
                    background-color: #f7f7f7;
                    padding: 5px 10px;
                    border-bottom: 1px solid #d9d9d9;
                    display: flex;
                    align-items: center;
                    width: 100%;
                }
                #_IDGenToolbar .sapMLabel {
                    font-weight: bold;
                    color: #333;
                    margin-right: 5px;
                    white-space: nowrap;
                    overflow: visible;
                    text-overflow: clip;
                    min-width: 120px;
                }
                #_IDGenToolbar .sapMInputBaseInner {
                    padding: 0 5px;
                    width: 100%;
                    min-width: 150px;
                }
                #_IDGenToolbar .sapMComboBox {
                    padding: 0 5px;
                    width: 100%;
                    min-width: 150px;
                }
                #_IDGenToolbar .sapMBtn {
                    margin-left: 5px;
                    padding: 5px 10px;
                    min-width: 150px;
                }
                #_IDGenToolbar .sapMTBSpacer {
                    flex-grow: 1;
                }
                #actionToolbar {
                    background-color: #f7f7f7;
                    padding: 5px 10px;
                    border-bottom: 1px solid #d9d9d9;
                    display: flex;
                    align-items: center;
                    width: 100%;
                }
                #actionToolbar .sapMBtn {
                    margin-left: 5px;
                    padding: 5px 10px;
                    min-width: 150px;
                }
                .sapMText {
                    visibility: visible !important;
                    white-space: normal !important;
                    overflow: visible !important;
                    text-overflow: clip !important;
                }
                .sapMListTblHeader .sapMText {
                    font-weight: bold;
                    color: #333;
                    padding: 5px;
                }
                .sapMListTblCell {
                    min-width: 120px;
                }
                .sapUiIcon {
                    margin-left: 5px;
                    cursor: pointer;
                }
                .sapUiIcon[id*="sortIcon_"] {
                    color: #ff0000 !important;
                }
            `;
            var oStyle = document.createElement("style");
            oStyle.type = "text/css";
            oStyle.innerHTML = sStyle;
            document.getElementsByTagName("head")[0].appendChild(oStyle);
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

        _refreshTable: function () {
            var oTable = this.byId("productsTable");
            if (oTable) {
                var oBinding = oTable.getBinding("items");
                if (oBinding) {
                    oBinding.refresh(true);
                }
            }
        },

        _centerTiles: function () {
            var oGrid = this.byId("tileGrid");
            if (oGrid) {
                oGrid.addStyleClass("centeredGrid");
            }
        },

        _parseDate: function (sDate) {
            if (!sDate) return new Date(0);
            var [day, month, year] = sDate.split("-").map(Number);
            return new Date(year, month - 1, day);
        },

        _updateSortIcon: function (sColumnKey, bDescending) {
            var sIconId = "sortIcon_" + sColumnKey;
            var oIcon = this.byId(sIconId);
            if (oIcon) {
                oIcon.setSrc(bDescending ? "sap-icon://sort-descending" : "sap-icon://sort-ascending");
            }
        },

        onSortSupplierRequestId: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            this._sortStates.supplierRequestId = !this._sortStates.supplierRequestId;
            var bDescending = this._sortStates.supplierRequestId;

            try {
                var aSupplierRequestIds = aItems.map(item => item.supplierRequestId);
                aSupplierRequestIds.sort((a, b) => {
                    var aNum = parseInt(a.replace("R", ""), 10) || 0;
                    var bNum = parseInt(b.replace("R", ""), 10) || 0;
                    return bDescending ? bNum - aNum : aNum - bNum;
                });

                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));
                aNewItems.forEach((item, index) => {
                    item.supplierRequestId = aSupplierRequestIds[index];
                });

                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();
                this._updateSortIcon("supplierRequestId", bDescending);
                MessageToast.show(`Sorted Supplier Request ID column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Supplier Request ID: " + e.message);
            }
        },

        onSortSupplierName: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            this._sortStates.supplierName = !this._sortStates.supplierName;
            var bDescending = this._sortStates.supplierName;

            try {
                var aSupplierNames = aItems.map(item => item.supplierName);
                aSupplierNames.sort((a, b) => {
                    var aValue = a || "";
                    var bValue = b || "";
                    return bDescending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
                });

                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));
                aNewItems.forEach((item, index) => {
                    item.supplierName = aSupplierNames[index];
                });

                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();
                this._updateSortIcon("supplierName", bDescending);
                MessageToast.show(`Sorted Supplier Name column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Supplier Name: " + e.message);
            }
        },

        onSortType: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            this._sortStates.type = !this._sortStates.type;
            var bDescending = this._sortStates.type;

            try {
                var aTypes = aItems.map(item => item.type);
                aTypes.sort((a, b) => {
                    var aValue = a || "";
                    var bValue = b || "";
                    return bDescending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
                });

                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));
                aNewItems.forEach((item, index) => {
                    item.type = aTypes[index];
                });

                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();
                this._updateSortIcon("type", bDescending);
                MessageToast.show(`Sorted Type column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Type: " + e.message);
            }
        },

        onSortRequestCreationDate: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            this._sortStates.requestCreationDate = !this._sortStates.requestCreationDate;
            var bDescending = this._sortStates.requestCreationDate;

            try {
                var aRequestCreationDates = aItems.map(item => item.requestCreationDate);
                aRequestCreationDates.sort((a, b) => {
                    var aDate = this._parseDate(a);
                    var bDate = this._parseDate(b);
                    return bDescending ? bDate - aDate : aDate - bDate;
                });

                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));
                aNewItems.forEach((item, index) => {
                    item.requestCreationDate = aRequestCreationDates[index];
                });

                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();
                this._updateSortIcon("requestCreationDate", bDescending);
                MessageToast.show(`Sorted Request Creation Date column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Request Creation Date: " + e.message);
            }
        },

        onSortRequestAging: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            this._sortStates.requestAging = !this._sortStates.requestAging;
            var bDescending = this._sortStates.requestAging;

            try {
                var aRequestAgings = aItems.map(item => item.requestAging);
                aRequestAgings.sort((a, b) => {
                    var aDays = parseInt(a.split(" ")[0], 10) || 0;
                    var bDays = parseInt(b.split(" ")[0], 10) || 0;
                    return bDescending ? bDays - aDays : aDays - bDays;
                });

                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));
                aNewItems.forEach((item, index) => {
                    item.requestAging = aRequestAgings[index];
                });

                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();
                this._updateSortIcon("requestAging", bDescending);
                MessageToast.show(`Sorted Request Aging column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Request Aging: " + e.message);
            }
        },

        onSortLastActionDate: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            this._sortStates.lastActionDate = !this._sortStates.lastActionDate;
            var bDescending = this._sortStates.lastActionDate;

            try {
                var aLastActionDates = aItems.map(item => item.lastActionDate);
                aLastActionDates.sort((a, b) => {
                    var aDate = this._parseDate(a);
                    var bDate = this._parseDate(b);
                    return bDescending ? bDate - aDate : aDate - bDate;
                });

                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));
                aNewItems.forEach((item, index) => {
                    item.lastActionDate = aLastActionDates[index];
                });

                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();
                this._updateSortIcon("lastActionDate", bDescending);
                MessageToast.show(`Sorted Last Action Date column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Last Action Date: " + e.message);
            }
        },

        onSortLastActionAging: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            this._sortStates.lastActionAging = !this._sortStates.lastActionAging;
            var bDescending = this._sortStates.lastActionAging;

            try {
                var aLastActionAgings = aItems.map(item => item.lastActionAging);
                aLastActionAgings.sort((a, b) => {
                    var aDays = parseInt(a.split(" ")[0], 10) || 0;
                    var bDays = parseInt(b.split(" ")[0], 10) || 0;
                    return bDescending ? bDays - aDays : aDays - bDays;
                });

                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));
                aNewItems.forEach((item, index) => {
                    item.lastActionAging = aLastActionAgings[index];
                });

                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();
                this._updateSortIcon("lastActionAging", bDescending);
                MessageToast.show(`Sorted Last Action Aging column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Last Action Aging: " + e.message);
            }
        },

        onSortStage: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            this._sortStates.stage = !this._sortStates.stage;
            var bDescending = this._sortStates.stage;

            try {
                var aStages = aItems.map(item => item.stage);
                aStages.sort((a, b) => {
                    var aValue = a || "";
                    var bValue = b || "";
                    return bDescending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
                });

                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));
                aNewItems.forEach((item, index) => {
                    item.stage = aStages[index];
                });

                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();
                this._updateSortIcon("stage", bDescending);
                MessageToast.show(`Sorted Stage column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Stage: " + e.message);
            }
        },

        onSortStatus: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            this._sortStates.status = !this._sortStates.status;
            var bDescending = this._sortStates.status;

            try {
                var aStatuses = aItems.map(item => item.status);
                aStatuses.sort((a, b) => {
                    var aValue = a || "";
                    var bValue = b || "";
                    return bDescending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
                });

                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));
                aNewItems.forEach((item, index) => {
                    item.status = aStatuses[index];
                });

                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();
                this._updateSortIcon("status", bDescending);
                MessageToast.show(`Sorted Status column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Status: " + e.message);
            }
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

            this._originalItems = JSON.parse(JSON.stringify(oData.items));

            var oTable = this.byId("productsTable");
            oTable.getBinding("items").refresh();

            MessageToast.show("New Supplier Request created successfully! ID: " + sNewId);
        },

        onDownloadPress: function () {
            var oModel = this.getView().getModel("products");
            var aItems = oModel.getProperty("/items");

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to download.");
                return;
            }

            // Define CSV headers
            var aHeaders = [
                "Supplier Request ID",
                "Supplier Name",
                "Type",
                "Request Creation Date",
                "Request Aging",
                "Last Action Date",
                "Last Action Aging",
                "Stage",
                "Status"
            ];

            // Map items to CSV rows
            var aRows = aItems.map(function (oItem) {
                return [
                    oItem.supplierRequestId,
                    oItem.supplierName,
                    oItem.type,
                    oItem.requestCreationDate,
                    oItem.requestAging,
                    oItem.lastActionDate,
                    oItem.lastActionAging,
                    oItem.stage,
                    oItem.status
                ].map(function (sValue) {
                    return '"' + (sValue || "").replace(/"/g, '""') + '"'; // Escape quotes
                }).join(",");
            });

            // Combine headers and rows
            var sCSVContent = aHeaders.join(",") + "\n" + aRows.join("\n");

            // Create a Blob with the CSV content
            var oBlob = new Blob([sCSVContent], { type: "text/csv;charset=utf-8;" });
            var sURL = window.URL.createObjectURL(oBlob);

            // Create a temporary link to trigger the download
            var oLink = document.createElement("a");
            oLink.setAttribute("href", sURL);
            oLink.setAttribute("download", "Supplier_Registration_Data.csv");
            document.body.appendChild(oLink);
            oLink.click();
            document.body.removeChild(oLink);

            MessageToast.show("Table data downloaded as CSV.");
        },

        onResetSort: function () {
            for (var sKey in this._sortStates) {
                if (this._sortStates.hasOwnProperty(sKey)) {
                    this._sortStates[sKey] = false;
                    this._updateSortIcon(sKey, false);
                }
            }

            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            oData.items = JSON.parse(JSON.stringify(this._originalItems));
            oModel.setData(oData);

            this._centerTiles();
            this._refreshTable();

            MessageToast.show("Sort state reset to original.");
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
                    { supplierRequestId: " Nissan GTR35", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "1-01-2024", requestAging: "10 Days", lastActionDate: "11-10-2024", lastActionAging: "15 Days", stage: "SUPPLIER", status: "PENDING" },
                    { supplierRequestId: "R18", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "2-02-2024", requestAging: "20 Days", lastActionDate: "12-10-2024", lastActionAging: "20 Days", stage: "SUPPLIER", status: "PENDING" },
                    { supplierRequestId: "R17", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "3-03-2024", requestAging: "30 Days", lastActionDate: "13-10-2024", lastActionAging: "30 Days", stage: "BUYER", status: "DRAFT" },
                    { supplierRequestId: "R16", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "4-04-2024", requestAging: "40 Days", lastActionDate: "14-10-2024", lastActionAging: "40 Days", stage: "BUYER", status: "CANCELLED" },
                    { supplierRequestId: "R16", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "5-04-2024", requestAging: "40 Days", lastActionDate: "14-10-2024", lastActionAging: "40 Days", stage: "BUYER", status: "CANCELLED" },
                    { supplierRequestId: "R15", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "6-05-2024", requestAging: "50 Days", lastActionDate: "15-10-2024", lastActionAging: "50 Days", stage: "ON BOARDING", status: "VENDOR CREATED" },
                    { supplierRequestId: "R14", supplierName: "ABC Pvt Ltd", type: "Direct", requestCreationDate: "7-06-2024", requestAging: "60 Days", lastActionDate: "16-10-2024", lastActionAging: "25 Days", stage: "ON BOARDING", status: "CMDM UPDATE PENDING" },
                    { supplierRequestId: "R13", supplierName: "ABC Pvt Ltd", type: "Indirect", requestCreationDate: "8-07-2024", requestAging: "70 Days", lastActionDate: "17-10-2024", lastActionAging: "35 Days", stage: "ON BOARDING", status: "FINANCE UPDATE PENDING" },
                    { supplierRequestId: "R12", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "9-08-2024", requestAging: "80 Days", lastActionDate: "18-10-2024", lastActionAging: "55 Days", stage: "ON BOARDING", status: "PURCHASE APPROVAL PENDING" },
                    { supplierRequestId: "R11", supplierName: "XYZ Pvt Ltd", type: "Indirect", requestCreationDate: "10-09-2024", requestAging: "90 Days", lastActionDate: "19-10-2024", lastActionAging: "45 Days", stage: "BUYER", status: "DRAFT" },
                    { supplierRequestId: "R13", supplierName: "XYZPvt Ltd", type: "Direct", requestCreationDate: "11-10-2024", requestAging: "100 Days", lastActionDate: "20-10-2024", lastActionAging: "75 Days", stage: "BUYER", status: "APPROVED" },
                    { supplierRequestId: "R10", supplierName: "XYZPvt Ltd", type: "Direct", requestCreationDate: "12-11-2024", requestAging: "100 Days", lastActionDate: "20-10-2024", lastActionAging: "75 Days", stage: "BUYER", status: "APPROVED" },
                    { supplierRequestId: "R9", supplierName: "XYZ Pvt Ltd", type: "Direct", requestCreationDate: "13-11-2024", requestAging: "110 Days", lastActionDate: "21-10-2024", lastActionAging: "65 Days", stage: "BUYER", status: "DRAFT" }
                ],
                draftCount: 0,
                myPendingCount: 0,
                pendingWithSupplierCount: 0,
                onBoardingCount: 0,
                allCount: 0
            };

            this._sortStates = {
                supplierRequestId: false,
                supplierName: false,
                type: false,
                requestCreationDate: false,
                requestAging: false,
                lastActionDate: false,
                lastActionAging: false,
                stage: false,
                status: false
            }; // Object to track sort state for each column
            this._originalItems = JSON.parse(JSON.stringify(oData.items)); // Store original data for reference
            this._updateTileCounts(oData);
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "products");

            // Add custom CSS for centering tiles and ensuring label visibility
            this._addCustomCSS();
        },

        _addCustomCSS: function () {
            var sStyle = `
                .centeredGrid {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .tileLayout {
                    min-width: 150px;
                    text-align: center;
                }
                #filterToolbar {
                    background-color: #f7f7f7;
                    padding: 5px 10px;
                    border-bottom: 1px solid #d9d9d9;
                    display: flex;
                    align-items: center;
                    width: 100%;
                }
                #filterToolbar .sapMLabel {
                    font-weight: bold;
                    color: #333;
                    margin-right: 5px;
                    white-space: nowrap;
                    overflow: visible;
                    text-overflow: clip;
                    min-width: 120px;
                }
                #filterToolbar .sapMInputBaseInner {
                    padding: 0 5px;
                    width: 100%;
                    min-width: 150px;
                }
                #filterToolbar .sapMComboBox {
                    padding: 0 5px;
                    width: 100%;
                    min-width: 150px;
                }
                #filterToolbar .sapMBtn {
                    margin-left: 5px;
                    padding: 5px 10px;
                    min-width: 150px;
                }
                #filterToolbar .sapMTBSpacer {
                    flex-grow: 1;
                }
                .sapMText {
                    visibility: visible !important;
                    white-space: normal !important;
                    overflow: visible !important;
                    text-overflow: clip !important;
                }
                .sapMListTblHeader .sapMText {
                    font-weight: bold;
                    color: #333;
                    padding: 5px;
                }
                .sapMListTblCell {
                    min-width: 120px;
                }
                .sapUiIcon {
                    margin-left: 5px;
                    cursor: pointer;
                }
                /* Add red color to sort icons */
                .sapUiIcon[id*="sortIcon_"] {
                    color: #ff0000 !important; /* Red color for sort icons */
                }
            `;
            var oStyle = document.createElement("style");
            oStyle.type = "text/css";
            oStyle.innerHTML = sStyle;
            document.getElementsByTagName("head")[0].appendChild(oStyle);
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

        // Helper function to refresh the table
        _refreshTable: function () {
            var oTable = this.byId("productsTable");
            if (oTable) {
                var oBinding = oTable.getBinding("items");
                if (oBinding) {
                    oBinding.refresh(true);
                }
            }
        },

        // Helper function to center tiles
        _centerTiles: function () {
            var oGrid = this.byId("tileGrid");
            if (oGrid) {
                oGrid.addStyleClass("centeredGrid");
            }
        },

        // Helper function to parse dates in DD-MM-YYYY format
        _parseDate: function (sDate) {
            if (!sDate) return new Date(0);
            var [day, month, year] = sDate.split("-").map(Number);
            return new Date(year, month - 1, day);
        },

        // Helper function to update the sort icon based on the sort state
        _updateSortIcon: function (sColumnKey, bDescending) {
            var sIconId = "sortIcon_" + sColumnKey;
            var oIcon = this.byId(sIconId);
            if (oIcon) {
                oIcon.setSrc(bDescending ? "sap-icon://sort-descending" : "sap-icon://sort-ascending");
            }
        },

        // Sort Supplier Request ID (sorts only the supplierRequestId column values, rows remain in original order)
        onSortSupplierRequestId: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            // Toggle sort direction for this column
            this._sortStates.supplierRequestId = !this._sortStates.supplierRequestId;
            var bDescending = this._sortStates.supplierRequestId;

            try {
                // Step 1: Extract supplierRequestId values
                var aSupplierRequestIds = aItems.map(item => item.supplierRequestId);

                // Step 2: Sort the supplierRequestId values independently
                aSupplierRequestIds.sort((a, b) => {
                    var aNum = parseInt(a.replace("R", ""), 10) || 0;
                    var bNum = parseInt(b.replace("R", ""), 10) || 0;
                    return bDescending ? bNum - aNum : aNum - bNum;
                });

                // Step 3: Create a new items array based on the original order
                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));

                // Step 4: Reassign the sorted supplierRequestId values to the new items array
                aNewItems.forEach((item, index) => {
                    item.supplierRequestId = aSupplierRequestIds[index];
                });

                // Step 5: Update the model with the new items
                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();

                // Step 6: Update the sort icon
                this._updateSortIcon("supplierRequestId", bDescending);

                MessageToast.show(`Sorted Supplier Request ID column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Supplier Request ID: " + e.message);
            }
        },

        // Sort Supplier Name (sorts only the supplierName column values, rows remain in original order)
        onSortSupplierName: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            // Toggle sort direction for this column
            this._sortStates.supplierName = !this._sortStates.supplierName;
            var bDescending = this._sortStates.supplierName;

            try {
                // Step 1: Extract supplierName values
                var aSupplierNames = aItems.map(item => item.supplierName);

                // Step 2: Sort the supplierName values independently
                aSupplierNames.sort((a, b) => {
                    var aValue = a || "";
                    var bValue = b || "";
                    return bDescending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
                });

                // Step 3: Create a new items array based on the original order
                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));

                // Step 4: Reassign the sorted supplierName values to the new items array
                aNewItems.forEach((item, index) => {
                    item.supplierName = aSupplierNames[index];
                });

                // Step 5: Update the model with the new items
                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();

                // Step 6: Update the sort icon
                this._updateSortIcon("supplierName", bDescending);

                MessageToast.show(`Sorted Supplier Name column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Supplier Name: " + e.message);
            }
        },

        // Sort Type (sorts only the type column values, rows remain in original order)
        onSortType: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            // Toggle sort direction for this column
            this._sortStates.type = !this._sortStates.type;
            var bDescending = this._sortStates.type;

            try {
                // Step 1: Extract type values
                var aTypes = aItems.map(item => item.type);

                // Step 2: Sort the type values independently
                aTypes.sort((a, b) => {
                    var aValue = a || "";
                    var bValue = b || "";
                    return bDescending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
                });

                // Step 3: Create a new items array based on the original order
                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));

                // Step 4: Reassign the sorted type values to the new items array
                aNewItems.forEach((item, index) => {
                    item.type = aTypes[index];
                });

                // Step 5: Update the model with the new items
                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();

                // Step 6: Update the sort icon
                this._updateSortIcon("type", bDescending);

                MessageToast.show(`Sorted Type column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Type: " + e.message);
            }
        },

        // Sort Request Creation Date (sorts only the requestCreationDate column values, rows remain in original order)
        onSortRequestCreationDate: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            // Toggle sort direction for this column
            this._sortStates.requestCreationDate = !this._sortStates.requestCreationDate;
            var bDescending = this._sortStates.requestCreationDate;

            try {
                // Step 1: Extract requestCreationDate values
                var aRequestCreationDates = aItems.map(item => item.requestCreationDate);

                // Step 2: Sort the requestCreationDate values independently
                aRequestCreationDates.sort((a, b) => {
                    var aDate = this._parseDate(a);
                    var bDate = this._parseDate(b);
                    return bDescending ? bDate - aDate : aDate - bDate;
                });

                // Step 3: Create a new items array based on the original order
                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));

                // Step 4: Reassign the sorted requestCreationDate values to the new items array
                aNewItems.forEach((item, index) => {
                    item.requestCreationDate = aRequestCreationDates[index];
                });

                // Step 5: Update the model with the new items
                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();

                // Step 6: Update the sort icon
                this._updateSortIcon("requestCreationDate", bDescending);

                MessageToast.show(`Sorted Request Creation Date column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Request Creation Date: " + e.message);
            }
        },

        // Sort Request Aging (sorts only the requestAging column values, rows remain in original order)
        onSortRequestAging: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            // Toggle sort direction for this column
            this._sortStates.requestAging = !this._sortStates.requestAging;
            var bDescending = this._sortStates.requestAging;

            try {
                // Step 1: Extract requestAging values
                var aRequestAgings = aItems.map(item => item.requestAging);

                // Step 2: Sort the requestAging values independently
                aRequestAgings.sort((a, b) => {
                    var aDays = parseInt(a.split(" ")[0], 10) || 0;
                    var bDays = parseInt(b.split(" ")[0], 10) || 0;
                    return bDescending ? bDays - aDays : aDays - bDays;
                });

                // Step 3: Create a new items array based on the original order
                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));

                // Step 4: Reassign the sorted requestAging values to the new items array
                aNewItems.forEach((item, index) => {
                    item.requestAging = aRequestAgings[index];
                });

                // Step 5: Update the model with the new items
                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();

                // Step 6: Update the sort icon
                this._updateSortIcon("requestAging", bDescending);

                MessageToast.show(`Sorted Request Aging column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Request Aging: " + e.message);
            }
        },

        // Sort Last Action Date (sorts only the lastActionDate column values, rows remain in original order)
        onSortLastActionDate: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            // Toggle sort direction for this column
            this._sortStates.lastActionDate = !this._sortStates.lastActionDate;
            var bDescending = this._sortStates.lastActionDate;

            try {
                // Step 1: Extract lastActionDate values
                var aLastActionDates = aItems.map(item => item.lastActionDate);

                // Step 2: Sort the lastActionDate values independently
                aLastActionDates.sort((a, b) => {
                    var aDate = this._parseDate(a);
                    var bDate = this._parseDate(b);
                    return bDescending ? bDate - aDate : aDate - bDate;
                });

                // Step 3: Create a new items array based on the original order
                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));

                // Step 4: Reassign the sorted lastActionDate values to the new items array
                aNewItems.forEach((item, index) => {
                    item.lastActionDate = aLastActionDates[index];
                });

                // Step 5: Update the model with the new items
                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();

                // Step 6: Update the sort icon
                this._updateSortIcon("lastActionDate", bDescending);

                MessageToast.show(`Sorted Last Action Date column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Last Action Date: " + e.message);
            }
        },

        // Sort Last Action Aging (sorts only the lastActionAging column values, rows remain in original order)
        onSortLastActionAging: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            // Toggle sort direction for this column
            this._sortStates.lastActionAging = !this._sortStates.lastActionAging;
            var bDescending = this._sortStates.lastActionAging;

            try {
                // Step 1: Extract lastActionAging values
                var aLastActionAgings = aItems.map(item => item.lastActionAging);

                // Step 2: Sort the lastActionAging values independently
                aLastActionAgings.sort((a, b) => {
                    var aDays = parseInt(a.split(" ")[0], 10) || 0;
                    var bDays = parseInt(b.split(" ")[0], 10) || 0;
                    return bDescending ? bDays - aDays : aDays - bDays;
                });

                // Step 3: Create a new items array based on the original order
                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));

                // Step 4: Reassign the sorted lastActionAging values to the new items array
                aNewItems.forEach((item, index) => {
                    item.lastActionAging = aLastActionAgings[index];
                });

                // Step 5: Update the model with the new items
                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();

                // Step 6: Update the sort icon
                this._updateSortIcon("lastActionAging", bDescending);

                MessageToast.show(`Sorted Last Action Aging column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Last Action Aging: " + e.message);
            }
        },

        // Sort Stage (sorts only the stage column values, rows remain in original order)
        onSortStage: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            // Toggle sort direction for this column
            this._sortStates.stage = !this._sortStates.stage;
            var bDescending = this._sortStates.stage;

            try {
                // Step 1: Extract stage values
                var aStages = aItems.map(item => item.stage);

                // Step 2: Sort the stage values independently
                aStages.sort((a, b) => {
                    var aValue = a || "";
                    var bValue = b || "";
                    return bDescending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
                });

                // Step 3: Create a new items array based on the original order
                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));

                // Step 4: Reassign the sorted stage values to the new items array
                aNewItems.forEach((item, index) => {
                    item.stage = aStages[index];
                });

                // Step 5: Update the model with the new items
                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();

                // Step 6: Update the sort icon
                this._updateSortIcon("stage", bDescending);

                MessageToast.show(`Sorted Stage column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Stage: " + e.message);
            }
        },

        // Sort Status (sorts only the status column values, rows remain in original order)
        onSortStatus: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            var aItems = oData.items;

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No data to sort.");
                return;
            }

            // Toggle sort direction for this column
            this._sortStates.status = !this._sortStates.status;
            var bDescending = this._sortStates.status;

            try {
                // Step 1: Extract status values
                var aStatuses = aItems.map(item => item.status);

                // Step 2: Sort the status values independently
                aStatuses.sort((a, b) => {
                    var aValue = a || "";
                    var bValue = b || "";
                    return bDescending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
                });

                // Step 3: Create a new items array based on the original order
                var aNewItems = JSON.parse(JSON.stringify(this._originalItems));

                // Step 4: Reassign the sorted status values to the new items array
                aNewItems.forEach((item, index) => {
                    item.status = aStatuses[index];
                });

                // Step 5: Update the model with the new items
                oModel.setProperty("/items", aNewItems);
                this._centerTiles();
                this._refreshTable();

                // Step 6: Update the sort icon
                this._updateSortIcon("status", bDescending);

                MessageToast.show(`Sorted Status column ${bDescending ? "Descending" : "Ascending"}`);
            } catch (e) {
                MessageToast.show("Error while sorting Status: " + e.message);
            }
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

            // Update the original items to reflect the new row
            this._originalItems = JSON.parse(JSON.stringify(oData.items));

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
        },

        onResetSort: function () {
            // Reset sort states
            for (var sKey in this._sortStates) {
                if (this._sortStates.hasOwnProperty(sKey)) {
                    this._sortStates[sKey] = false;
                    this._updateSortIcon(sKey, false);
                }
            }

            // Restore original data
            var oModel = this.getView().getModel("products");
            var oData = oModel.getData();
            oData.items = JSON.parse(JSON.stringify(this._originalItems));
            oModel.setData(oData);

            this._centerTiles();
            this._refreshTable();

            MessageToast.show("Sort state reset to original.");
        }
    });
});










