export class TokenRoleList {
    //// خانه //
    Home_see = false;

// تقویم
    calender_see = false;

    //// کاربر //
    User_create = false;
    User_update = false;
    User_see = false;
    User_delete = false;
    User_list = false;


    ///// پست /
    UserType_create = false;
    UserType_update = false;
    UserType_see = false;
    UserType_delete = false;
    UserType_list = false;

    ////// شهرستان /
    City_create = false;
    City_update = false;
    City_see = false;
    City_delete = false;
    City_list = false;

    ////// استان //
    Province_create = false;
    Province_update = false;
    Province_see = false;
    Province_delete = false;
    Province_list = false;

    //// واحد پول
    Currency_create = false;
    Currency_delete = false;
    Currency_list = false;
    Currency_update = false;
    Currency_see = false;

    //// بودجه /
    Budget_create = false;
    Budget_update = false;
    Budget_see = false;
    Budget_delete = false;
    Budget_list = false;

    ////  آرشیو دستور کار- تصادفی /
    WorkOrderRandom_list = false;
    WorkOrderRandom_see = false;
    WorkOrderRandom_update = false;
    WorkOrderRandom_delete = false;
    ////  آرشیو دستور کار- زمانبندی شده /
    WorkOrderScheduling_list = false;
    WorkOrderScheduling_see = false;
    WorkOrderScheduling_update = false;
    WorkOrderScheduling_delete = false;

    workRequest_list = false;
    workRequest_see = false;
    workRequest_delete = false;
    workRequest_create = false;


    // /// وضعیت دستور کار
    WorkOrderStatus_create = false;
    WorkOrderStatus_update = false;
    WorkOrderStatus_see = false;
    WorkOrderStatus_delete = false;
    WorkOrderStatus_list = false;

    ////// واجد اندازه گیری
    Measurement_create = false;
    Measurement_update = false;
    Measurement_see = false;
    Measurement_delete = false;
    Measurement_list = false;


    ///// دسته بندی  مشخصات
    PropertyCategory_create = false;
    PropertyCategory_update = false;
    PropertyCategory_see = false;
    PropertyCategory_delete = false;
    PropertyCategory_list = false;

    ///// مشخصات
    Property_create = false;
    Property_update = false;
    Property_see = false;
    Property_delete = false;
    Property_list = false;

    //// شرکت
    Company_create = false;
    Company_update = false;
    Company_see = false;
    Company_delete = false;
    Company_list = false;


    //// سازمانها
    organization_create = false;
    organization_update = false;
    organization_see = false;
    organization_delete = false;
    organization_list = false;


    ///// انبار
    Storage_create = false;
    Storage_update = false;
    Storage_see = false;
    Storage_delete = false;
    Storage_list = false;

    /// مسئول Department
    ChargeDepartment_create = false;
    ChargeDepartment_update = false;
    ChargeDepartment_see = false;
    ChargeDepartment_delete = false;
    ChargeDepartment_list = false;


    // // خانواده گروه دارایی
    assetCategory_create = false;
    assetCategory_update = false;
    assetCategory_see = false;
    assetCategory_delete = false;
    assetCategory_list = false;

    //// قالب دارایی
    AssetTemplate_create = false;
    AssetTemplate_update = false;
    AssetTemplate_see = false;
    AssetTemplate_delete = false;
    AssetTemplate_list = false;

    ////  دارایی
    Asset_create = false;
    Asset_update = false;
    Asset_see = false;
    Asset_delete = false;
    Asset_list = false;

    ////  پروژه
    Project_create = false;
    Project_update = false;
    Project_see = false;
    Project_delete = false;
    Project_list = false;

    ////  زمانبندی
    Scheduling_create = false;
    Scheduling_update = false;
    Scheduling_see = false;
    Scheduling_delete = false;
    Scheduling_list = false;

    ////  مجموعه کار
    TaskGroup_create = false;
    TaskGroup_update = false;
    TaskGroup_see = false;
    TaskGroup_delete = false;
    TaskGroup_list = false;

    ////  قطعات
    Part_create = false;
    Part_update = false;
    Part_see = false;
    Part_delete = false;
    Part_list = false;

    ////  موجودی
    Inventory_create = false;
    Inventory_see = false;
    Inventory_update = false;
    Inventory_delete = false;
    Inventory_list = false;

    //// تنظیم موجودی
    AdjustInventory_create = false;
    AdjustInventory_see = false;
    AdjustInventory_delete = false;


    // ساختار فنی ماشین آلات و تجهیزات
    BOM_create = false;
    BOM_update = false;
    BOM_see = false;
    BOM_delete = false;
    BOM_list = false;

    //فرم ساز
    formBuilder_create = false;
    formBuilder_delete = false;
    formBuilder_list = false;
    formBuilder_edit = false;
    formBuilder_detail = false;

    // فرآیند ساز
    processBuilder_create = false;
    processBuilder_delete = false;
    processBuilder_list = false;
    processBuilder_edit = false;
    processBuilder_detail = false;

    // متراژ خوانی
    metering_detail = false;
    metering_create = false;
    metering_list = false;

    // دسته بندی فرم
    formCategory_create = false // 'ایجاد دسته بندی فرم'
    formCategory_update = false // 'ویرایش دسته بندی فرم'
    formCategory_see = false // 'مشاهده دسته بندی فرم'
    formCategory_delete = false // 'حذف دسته بندی فرم'
    formCategory_list = false // 'مشاهده لیست دسته بندی فرم'


    //پیام رسان
    message_received_Detail = false;
    message_received_Delete = false;
    message_sender_Detail = false;
    message_sender_Delete = false;
    message_system_Detail = false;
    message_system_Delete = false;
    message_send = false;
    message_Delete_list = false;
    message_received_list = false;// 'لیست پیام های دریافتی'
    message_sender_list = false;// 'لیست پیام های ارسال شده'
    message_system_list = false;// 'لیست پیام های سیستمی'

    message_Delete_Detail = false; // 'مشاهده پیام های حذف شده'
    message_Delete_Delete = false; // 'حذف پیام های حذف شده'
    // دارایی تخصیص یافته
    AssignedAsset_update = false;
    AssignedAsset_see = false;
    AssignedAsset_list = false;


    // قطعات تخصیص یافته
    AssignedPart_update = false;
    AssignedPart_see = false;
    AssignedPart_list = false;

    // ;دستور کار تخصیص یافته
    AssignedWorkOrder_update = false;
    AssignedWorkOrder_see = false;
    AssignedWorkOrder_list = false;


    // کارتابل(برای یکسان سازی دسترسی ها به این صورت شدن)

    noticeBoard_see = false;  // 'مشاهده کارتابل همه'
    noticeBoard_create = false; // 'مشاهده کارتابل تاریخچه فعال',    //
    noticeBoard_update = false; // 'مشاهده کارتابل تاریخچه اتمام یافته',  //
    noticeBoard_awaiting_list_random = false; // 'مشاهده لیست فرایند در انتظار تایید - تصادفی'
    noticeBoard_awaiting_list_scheduling = false; // 'مشاهده لیست فرایند در انتظار تایید - زمانبندی شده'
    noticeBoard_active_list = false; // 'مشاهده لیست تاریخچه فعال'
    noticeBoard_completed_list = false; // 'مشاهده لیست کارتابل تاریخچه اتمام یافته',

    // //// دارایی تخصیص یافته
    // myAssets_detail = false;
    // myAssets_edit = false;

    // // قطعات تخصیص یافته
    // myParts_detail = false;
    // myParts_edit = false;
    //
    // //دستور کار تخصیص یافته
    // myWorkOrders_detail = false;
    // myWorkOrders_edit = false;

// گزارش گیری
    Report_usedPart = false; // قطعات مصرفی
    Report_personnelWorkTime = false; // کارکرد پرسنل
    Report_keyPerformanceIndicator = false; // keyPerformanceIndicator

    // نوع فعایت
    TypeOfActivity_create = false;
    TypeOfActivity_list = false;
    TypeOfActivity_update = false;
    TypeOfActivity_Delete = false;
    // رسته کاری
    WorkingField_create = false;
    WorkingField_list = false;
    WorkingField_update = false;
    WorkingField_Delete = false;
    // روانکارها
    Lubricant_create = false;
    Lubricant_list = false;
    Lubricant_update = false;
    Lubricant_Delete = false;
    // درجه اهمیت
    DegreeOfImportance_create = false;
    DegreeOfImportance_list = false;
    DegreeOfImportance_update = false;
    DegreeOfImportance_Delete = false;

    public static CreateRoleList(roleList) {
        const roleL = new TokenRoleList();
        for (const role of roleList) {
            switch (role) {
                case 'Home_see':
                    roleL.Home_see = true;
                    break;
                case 'User_create':
                    roleL.User_create = true;
                    break;
                case 'User_update':
                    roleL.User_update = true;
                    break;
                case 'User_see':
                    roleL.User_see = true;
                    break;
                case 'User_delete':
                    roleL.User_delete = true;
                    break;
                case 'User_list':
                    roleL.User_list = true;
                    break;
                case 'UserType_create':
                    roleL.UserType_create = true;
                    break;
                case 'UserType_update':
                    roleL.UserType_update = true;
                    break;
                case 'UserType_see':
                    roleL.UserType_see = true;
                    break;
                case 'UserType_delete':
                    roleL.UserType_delete = true;
                    break;
                case 'UserType_list':
                    roleL.UserType_list = true;
                    break;
                case 'City_create':
                    roleL.City_create = true;
                    break;
                case 'City_update':
                    roleL.City_update = true;
                    break;
                case 'City_see':
                    roleL.City_see = true;
                    break;
                case 'City_delete':
                    roleL.City_delete = true;
                    break;
                case 'City_list':
                    roleL.City_list = true;
                    break;
                case 'Province_create':
                    roleL.Province_create = true;
                    break;
                case 'Province_update':
                    roleL.Province_update = true;
                    break;
                case 'Province_see':
                    roleL.Province_see = true;
                    break;
                case 'Province_delete':
                    roleL.Province_delete = true;
                    break;
                case 'Province_list':
                    roleL.Province_list = true;
                    break;
                case 'Currency_create':
                    roleL.Currency_create = true;
                    break;
                case 'Currency_delete':
                    roleL.Currency_delete = true;
                    break;
                case 'Currency_list':
                    roleL.Currency_list = true;
                    break;
                case 'Currency_update':
                    roleL.Currency_update = true;
                    break;
                case 'Currency_see':
                    roleL.Currency_see = true;
                    break;
                case 'Budget_create':
                    roleL.Budget_create = true;
                    break;
                case 'Budget_update':
                    roleL.Budget_update = true;
                    break;
                case 'Budget_see':
                    roleL.Budget_see = true;
                    break;
                case 'Budget_delete':
                    roleL.Budget_delete = true;
                    break;
                case 'Budget_list':
                    roleL.Budget_list = true;
                    break;


                case 'WorkOrderRandom_update':
                    roleL.WorkOrderRandom_update = true;
                    break;
                case 'WorkOrderRandom_see':
                    roleL.WorkOrderRandom_see = true;
                    break;
                case 'WorkOrderRandom_delete':
                    roleL.WorkOrderRandom_delete = true;
                    break;
                case 'WorkOrderRandom_list':
                    roleL.WorkOrderRandom_list = true;
                    break;


                case 'WorkOrderScheduling_update':
                    roleL.WorkOrderScheduling_update = true;
                    break;
                case 'WorkOrderScheduling_see':
                    roleL.WorkOrderScheduling_see = true;
                    break;
                case 'WorkOrderScheduling_delete':
                    roleL.WorkOrderScheduling_delete = true;
                    break;
                case 'WorkOrderScheduling_list':
                    roleL.WorkOrderScheduling_list = true;
                    break;

                case 'workRequest_list':
                    roleL.workRequest_list = true;
                    break;
                case 'workRequest_see':
                    roleL.workRequest_see = true;
                    break;
                case 'workRequest_delete':
                    roleL.workRequest_delete = true;
                    break;
                case 'workRequest_create':
                    roleL.workRequest_create = true;
                    break;

                case 'WorkOrderStatus_create':
                    roleL.WorkOrderStatus_create = true;
                    break;
                case 'WorkOrderStatus_update':
                    roleL.WorkOrderStatus_update = true;
                    break;
                case 'WorkOrderStatus_see':
                    roleL.WorkOrderStatus_see = true;
                    break;
                case 'WorkOrderStatus_delete':
                    roleL.WorkOrderStatus_delete = true;
                    break;
                case 'WorkOrderStatus_list':
                    roleL.WorkOrderStatus_list = true;
                    break;
                case 'Measurement_create':
                    roleL.Measurement_create = true;
                    break;
                case 'Measurement_update':
                    roleL.Measurement_update = true;
                    break;
                case 'Measurement_see':
                    roleL.Measurement_see = true;
                    break;
                case 'Measurement_delete':
                    roleL.Measurement_delete = true;
                    break;
                case 'Measurement_list':
                    roleL.Measurement_list = true;
                    break;
                case 'Property_create':
                    roleL.Property_create = true;
                    break;
                case 'Property_update':
                    roleL.Property_update = true;
                    break;
                case 'Property_see':
                    roleL.Property_see = true;
                    break;
                case 'Property_delete':
                    roleL.Property_delete = true;
                    break;
                case 'Property_list':
                    roleL.Property_list = true;
                    break;

                case 'PropertyCategory_create':
                    roleL.PropertyCategory_create = true;
                    break;
                case 'PropertyCategory_update':
                    roleL.PropertyCategory_update = true;
                    break;
                case 'PropertyCategory_see':
                    roleL.PropertyCategory_see = true;
                    break;
                case 'PropertyCategory_delete':
                    roleL.PropertyCategory_delete = true;
                    break;
                case 'PropertyCategory_list':
                    roleL.PropertyCategory_list = true;
                    break;


                case 'Company_create':
                    roleL.Company_create = true;
                    break;
                case 'Company_update':
                    roleL.Company_update = true;
                    break;
                case 'Company_see':
                    roleL.Company_see = true;
                    break;
                case 'Company_delete':
                    roleL.Company_delete = true;
                    break;
                case 'Company_list':
                    roleL.Company_list = true;
                    break;
                //// سازمانها
                case 'organization_create':
                    roleL.organization_create = true;
                    break;
                case 'organization_update':
                    roleL.organization_update = true;
                    break;
                case 'organization_see':
                    roleL.organization_see = true;
                    break;
                case 'organization_delete':
                    roleL.organization_delete = true;
                    break;
                case 'organization_list':
                    roleL.organization_list = true;
                    break;
                case 'Storage_create':
                    roleL.Storage_create = true;
                    break;
                case 'Storage_update':
                    roleL.Storage_update = true;
                    break;
                case 'Storage_see':
                    roleL.Storage_see = true;
                    break;
                case 'Storage_delete':
                    roleL.Storage_delete = true;
                    break;
                case 'Storage_list':
                    roleL.Storage_list = true;
                    break;
                case 'ChargeDepartment_create':
                    roleL.ChargeDepartment_create = true;
                    break;
                case 'ChargeDepartment_update':
                    roleL.ChargeDepartment_update = true;
                    break;
                case 'ChargeDepartment_see':
                    roleL.ChargeDepartment_see = true;
                    break;
                case 'ChargeDepartment_delete':
                    roleL.ChargeDepartment_delete = true;
                    break;
                case 'ChargeDepartment_list':
                    roleL.ChargeDepartment_list = true;
                    break;
                // // خانواده گروه دارایی

                case 'assetCategory_create':
                    roleL.assetCategory_create = true;
                    break;
                case 'assetCategory_update':
                    roleL.assetCategory_update = true;
                    break;
                case 'assetCategory_see':
                    roleL.assetCategory_see = true;
                    break;
                case 'assetCategory_delete':
                    roleL.assetCategory_delete = true;
                    break;
                case 'assetCategory_list':
                    roleL.assetCategory_list = true;
                    break;

                case 'AssetTemplate_create':
                    roleL.AssetTemplate_create = true;
                    break;
                case 'AssetTemplate_update':
                    roleL.AssetTemplate_update = true;
                    break;
                case 'AssetTemplate_see':
                    roleL.AssetTemplate_see = true;
                    break;
                case 'AssetTemplate_delete':
                    roleL.AssetTemplate_delete = true;
                    break;
                case 'AssetTemplate_list':
                    roleL.AssetTemplate_list = true;
                    break;
                case 'Asset_create':
                    roleL.Asset_create = true;
                    break;
                case 'Asset_update':
                    roleL.Asset_update = true;
                    break;
                case 'Asset_see':
                    roleL.Asset_see = true;
                    break;
                case 'Asset_delete':
                    roleL.Asset_delete = true;
                    break;
                case 'Asset_list':
                    roleL.Asset_list = true;
                    break;
                case 'Project_create':
                    roleL.Project_create = true;
                    break;
                case 'Project_update':
                    roleL.Project_update = true;
                    break;
                case 'Project_see':
                    roleL.Project_see = true;
                    break;
                case 'Project_delete':
                    roleL.Project_delete = true;
                    break;
                case 'Project_list':
                    roleL.Project_list = true;
                    break;
                case 'Scheduling_create':
                    roleL.Scheduling_create = true;
                    break;
                case 'Scheduling_update':
                    roleL.Scheduling_update = true;
                    break;
                case 'Scheduling_see':
                    roleL.Scheduling_see = true;
                    break;
                case 'Scheduling_delete':
                    roleL.Scheduling_delete = true;
                    break;
                case 'Scheduling_list':
                    roleL.Scheduling_list = true;
                    break;
                case 'TaskGroup_create':
                    roleL.TaskGroup_create = true;
                    break;
                case 'TaskGroup_update':
                    roleL.TaskGroup_update = true;
                    break;
                case 'TaskGroup_see':
                    roleL.TaskGroup_see = true;
                    break;
                case 'TaskGroup_delete':
                    roleL.TaskGroup_delete = true;
                    break;
                case 'TaskGroup_list':
                    roleL.TaskGroup_list = true;
                    break;
                case 'Part_create':
                    roleL.Part_create = true;
                    break;
                case 'Part_update':
                    roleL.Part_update = true;
                    break;
                case 'Part_see':
                    roleL.Part_see = true;
                    break;
                case 'Part_delete':
                    roleL.Part_delete = true;
                    break;
                case 'Part_list':
                    roleL.Part_list = true;
                    break;
                case 'Inventory_create':
                    roleL.Inventory_create = true;
                    break;
                case 'Inventory_see':
                    roleL.Inventory_see = true;
                    break;
                case 'Inventory_delete':
                    roleL.Inventory_delete = true;
                    break;
                case 'Inventory_list':
                    roleL.Inventory_list = true;
                    break;
                case 'AdjustInventory_create':
                    roleL.AdjustInventory_create = true;
                    break;
                case 'AdjustInventory_see':
                    roleL.AdjustInventory_see = true;
                    break;
                case 'AdjustInventory_delete':
                    roleL.AdjustInventory_delete = true;
                    break;
                case 'BOM_create':
                    roleL.BOM_create = true;
                    break;
                case 'BOM_update':
                    roleL.BOM_update = true;
                    break;
                case 'BOM_see':
                    roleL.BOM_see = true;
                    break;
                case 'BOM_delete':
                    roleL.BOM_delete = true;
                    break;
                case 'BOM_list':
                    roleL.BOM_list = true;
                    break;
                case 'formBuilder_create':
                    roleL.formBuilder_create = true;
                    break;
                case 'formBuilder_delete':
                    roleL.formBuilder_delete = true;
                    break;
                case 'formBuilder_list':
                    roleL.formBuilder_list = true;
                    break;
                case 'formBuilder_edit':
                    roleL.formBuilder_edit = true;
                    break;
                case 'formBuilder_detail':
                    roleL.formBuilder_detail = true;
                    break;
                case 'processBuilder_create':
                    roleL.processBuilder_create = true;
                    break;
                case 'processBuilder_delete':
                    roleL.processBuilder_delete = true;
                    break;
                case 'processBuilder_list':
                    roleL.processBuilder_list = true;
                    break;
                case 'processBuilder_edit':
                    roleL.processBuilder_edit = true;
                    break;
                case 'processBuilder_detail':
                    roleL.processBuilder_detail = true;
                    break;
                case 'metering_detail':
                    roleL.metering_detail = true;
                    break;
                case 'metering_create':
                    roleL.metering_create = true;
                    break;
                case 'metering_list':
                    roleL.metering_list = true;
                    break;

                // پیام رسان
                case 'message_received_Detail':
                    roleL.message_received_Detail = true;
                    break;
                case 'message_received_Delete':
                    roleL.message_received_Delete = true;
                    break;
                case 'message_sender_Detail':
                    roleL.message_sender_Detail = true;
                    break;
                case 'message_sender_Delete':
                    roleL.message_sender_Delete = true;
                    break;
                case 'message_system_Detail':
                    roleL.message_system_Detail = true;
                    break;
                case 'message_system_Delete':
                    roleL.message_system_Delete = true;
                    break;
                case 'message_send':
                    roleL.message_send = true;
                    break;
                case 'message_Delete_list':
                    roleL.message_Delete_list = true;
                    break;
                case 'message_received_list':
                    roleL.message_received_list = true;
                    break;
                case 'message_sender_list':
                    roleL.message_sender_list = true;
                    break;
                case 'message_system_list':
                    roleL.message_system_list = true;
                    break;


                case 'message_Delete_Detail':
                    roleL.message_Delete_Detail = true;
                    break;

                case 'message_Delete_Delete':
                    roleL.message_Delete_Delete = true;
                    break;


                case 'AssignedAsset_update':
                    roleL.AssignedAsset_update = true;
                    break;
                case 'AssignedAsset_see':
                    roleL.AssignedAsset_see = true;
                    break;
                case 'AssignedAsset_list':
                    roleL.AssignedAsset_list = true;
                    break;
                case 'AssignedPart_update':
                    roleL.AssignedPart_update = true;
                    break;
                case 'AssignedPart_see':
                    roleL.AssignedPart_see = true;
                    break;
                case 'AssignedPart_list':
                    roleL.AssignedPart_list = true;
                    break;
                case 'AssignedWorkOrder_update':
                    roleL.AssignedWorkOrder_update = true;
                    break;
                case 'AssignedWorkOrder_see':
                    roleL.AssignedWorkOrder_see = true;
                    break;
                case 'AssignedWorkOrder_list':
                    roleL.AssignedWorkOrder_list = true;
                    break;


                // کارتابل(برای یکسان سازی دسترسی ها به این صورت شدن)
                case 'noticeBoard_see':
                    roleL.noticeBoard_see = true;
                    break;
                case 'noticeBoard_create':
                    roleL.noticeBoard_create = true;
                    break;
                case 'noticeBoard_update':
                    roleL.noticeBoard_update = true;
                    break;
                case 'noticeBoard_awaiting_list_random':
                    roleL.noticeBoard_awaiting_list_random = true;
                    break;
                case 'noticeBoard_awaiting_list_scheduling':
                    roleL.noticeBoard_awaiting_list_scheduling = true;
                    break;
                case 'noticeBoard_active_list':
                    roleL.noticeBoard_active_list = true;
                    break;
                case 'noticeBoard_completed_list':
                    roleL.noticeBoard_completed_list = true;
                    break;
                // دسته بندی فرم
                case 'formCategory_create':
                    roleL.formCategory_create = true;
                    break;
                case 'formCategory_update':
                    roleL.formCategory_update = true;
                    break;
                case 'formCategory_see':
                    roleL.formCategory_see = true;
                    break;
                case 'formCategory_delete':
                    roleL.formCategory_delete = true;
                    break;
                case 'formCategory_list':
                    roleL.formCategory_list = true;
                    break;
                case 'Report_usedPart':
                    roleL.Report_usedPart = true;
                    break;
                case 'Report_personnelWorkTime':
                    roleL.Report_personnelWorkTime = true;
                    break;
                case 'Report_keyPerformanceIndicator':
                    roleL.Report_keyPerformanceIndicator = true;
                    break;
                // نوع فعالیت
                case 'TypeOfActivity_create':
                    roleL.TypeOfActivity_create = true;
                    break;
                case 'TypeOfActivity_list':
                    roleL.TypeOfActivity_list = true;
                    break;
                case 'TypeOfActivity_update':
                    roleL.TypeOfActivity_update = true;
                    break;
                case 'TypeOfActivity_Delete':
                    roleL.TypeOfActivity_Delete = true;
                    break;
                // رسته کاری
                case 'WorkingField_create':
                    roleL.WorkingField_create = true;
                    break;
                case 'WorkingField_list':
                    roleL.WorkingField_list = true;
                    break;
                case 'WorkingField_update':
                    roleL.WorkingField_update = true;
                    break;
                case 'WorkingField_Delete':
                    roleL.WorkingField_Delete = true;
                    break;
                    // روانکارها
                case 'Lubricant_create':
                    roleL.Lubricant_create = true;
                    break;
                case 'Lubricant_list':
                    roleL.Lubricant_list = true;
                    break;
                case 'Lubricant_update':
                    roleL.Lubricant_update = true;
                    break;
                case 'Lubricant_Delete':
                    roleL.Lubricant_Delete = true;
                    break;
                // درجه اهمیت
                case 'DegreeOfImportance_create':
                    roleL.DegreeOfImportance_create = true;
                    break;
                case 'DegreeOfImportance_list':
                    roleL.DegreeOfImportance_list = true;
                    break;
                case 'DegreeOfImportance_update':
                    roleL.DegreeOfImportance_update = true;
                    break;
                case 'DegreeOfImportance_Delete':
                    roleL.DegreeOfImportance_Delete = true;
                    break;
                case 'calender_see':
                    roleL.calender_see = true;
                    break;


            }
        }
        return roleL;
    }

}
