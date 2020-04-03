//Products
export interface IProduct {
    id: number;
    productCode: string;
    productName: string;
    productType: string;
    bgColor: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
  
}

export interface ICountry {
    id: number;
    countryCode: string;
    countryName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}
//RawMaterial
export interface IRawMaterial {
    id: number;
    rawMaterialCode: string;
    rawMaterialName: string;
    rawMaterialType: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

//Article
export interface IArticle {
    id: number;
    articleName: string;
    useForProductId: number;
    operationInstruction: IOperationInstruction[];
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

//Process
export interface IProcess {
    id: number;
    processCode: string;
    processName: string;
    processType: string;
    defaultStandard: string;
    defaultMessage: string;
    machineRunningSpeed : number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}
export interface IProcessLot {
    id: number;
    processCode: string;
    processName: string;
    processType: string;
    defaultStandard: string;
    checkEPCStandard: string;
    checkCleanStandard: string;
    defaultMessage: string;
    machineRunningSpeed: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}
//Account
export interface IAccount {
    id: number;
    identityId: string;
    userName: string;
    prefixName: string;
    firstName: string;
    lastName: string;
    defaultLangCode: string;
    isAdmin: boolean;
    userRole: string;
    userLevel: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

//TirotEdge
export interface ITirotEdge {
    id: number;
    name: string;
    installLocation: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface IOperationInstruction {
    id: number;
    articleId: number;
    process: IProcess;
    rawmaterialName: string;
    product: IProduct;
    usingStandard: string;
    orderNo: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

//ShiftSchdule
export interface IShiftSchdule {
    id: number;
    shiftNo: number;
    shiftHour: number;
    shiftName: string;
    startShiftDay: number;
    startShiftHour: number;
    startShiftMinute: number;
    endShiftDay: number;
    endShiftHour: number;
    endShiftMinute: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}
//Customer
export interface ICustomer {
    id: number;
    customerCode: string;
    customerName: string;
    customerShortName: string;
    address1: string;
    address2: string;
    contractPerson: string;
    phoneNo: string;
    faxNo: string;
    emailAddress: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
    lineContract: string;
    contractPerson2: string;
    phoneNo2: string;
    faxNo2: string;
    emailAddress2: string;
    lineContract2: string;
    contractPerson3: string;
    phoneNo3: string;
    faxNo3: string;
    emailAddress3: string;
    lineContract3: string;
}
export interface ICountry {
    id: number;
    countryCode: string;
    countryName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}


//Team
export interface ITeam {
    id: number;
    teamName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

//Station
export interface InStationGroup {
    id: number;
    stationGroupName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface IStation {
    id: number;
    stationName: string;
    stationGroupId: number;
    inStationGroup: InStationGroup;
    machineId: number;
    inMachine: InMachine;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface InMachine {
    id: number;
    machineName: string;
    machineModel: string;
    machineLocation: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}


// StationGroup
export interface IStationGroup {
    id: number;
    stationGroupName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

//SysRole
export interface ISysRole {
    id: number;
    rolesName: string;
    rolesLevel: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

//ProductionOrder
export interface IProductionOrder {
	productCode: string;
	productName: string;
	orderQty: number;
	fgQty: number;
	deliveryQty: number;
	deliveryMonth: number;
	deliveryYear: number;
	productId: number;
	orderDetail: any[];
}

export interface ICustomerOrder {
	id: number;
	customerCode: string;
	customerName: string;
	customerShortName: string;
	address1: string;
	address2: string;
	contractPerson: string;
	phoneNo: string;
	faxNo: string;
	emailAddress: string;
	createBy: string;
	createDate: string;
	updateBy: string;
	updateDate: string;
	inActivated: boolean;
}

export interface IOrderItem {
	id: number;
	itemNo: number;
	productionOrderId: number;
	productId: number;
	product: IProduct;
	status: string;
	orderQty: number;
	createBy: string;
	createDate: string;
	updateBy: string;
	updateDate: string;
}

export interface IProductionOrder {
	id: number;
	productionOrderNo: string;
	productionOrderDate: string;
	status: string;
	madeTo: string;
	customerOrderId: number;
	customerOrder: ICustomerOrder;
	cutomerOrderDate: string;
	deliveryDate: string;
	remark: string;
	orderItems: IOrderItem[];
	createBy: string;
	createDate: string;
	updateBy: string;
	updateDate: string;
}


export interface IProductionPlanByMonthAndShift {
	id: number;
	planDate: string;
	planStartTime: string;
	caption: string;
	bgColor: string;
}

export interface IDefect {
   
    id: number;
    defectCode: string;
    defectName: string;
    defectNameTH: string;
    defectType: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface IGrade {
    id: number;
    gradeName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface IUom {
    id: number;
    uomName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface IMachineCheckList {
    id: number;
    machineId: number;
    groupOrder: number;
    lineOrder: number;
    noColumnInLine: number;
    captionCol1: string;
    dataTypeCol1: string;
    captionCol2: string;
    dataTypeCol2: string;
    stdMinValue1: number;
    stdMaxValue1: number;
    stdMinValue2: number;
    stdMaxValue2: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface IMachineCheckListForProcess {
    id: number;
    processId: number;
    machineCheckListTemplateId: number;
    machineId: number;
    groupOrder: number;
    lineOrder: number;
    noColumnInLine: number;
    captionCol1: string;
    dataTypeCol1: string;
    captionCol2: string;
    dataTypeCol2: string;
    stdMinValue1: number;
    stdMaxValue1: number;
    stdMinValue2: number;
    stdMaxValue2: number;
    checkSelected: boolean;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface Sensor {
    id: number;
    machineId: number;
    sensorName: string;
    macAddress: string;
    uid: string;
    sensorLocation: string;
    sensorGroupName: string;
    sensorValueUnitName: string;
    isMachineStatus: boolean;
    sensorValueType: number;
    dataRetrievalType: number;
    pullInterfaceType: number;
    deviceIP: string;
    devicePort: number;
    deviceUnitId: number;
    commPortName: string;
    baudrate: number;
    parity: number;
    stopBit: number;
    invokeCommand: string;
    connectionString: string;
    sensorExpression: string;
    limitMaxValue: number;
    limitMinValue: number;
    remark: string;
    tirotEdgeId: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface IMachine {
    id: number;
    machineName: string;
    machineGroupName: string;
    machineModel: string;
    machineLocation: string;
    sensors: Sensor[];
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

