export enum AccessController {
    Home_see = 'مشاهده صفحه خانه ' as any,
    calender_see = 'مشاهده ' as any,


    User_create = 'ایجاد کاربر' as any,
    User_update = 'ویرایش کاربر' as any,
    User_see = 'مشاهده جزئیات کاربر' as any,
    User_delete = 'حذف کاربر' as any,
    User_list = 'مشاهده لیست کاربر' as any,

    UserType_create = 'ایجاد پست' as any,
    UserType_update = 'ویرایش پست' as any,
    // UserType_see = 'مشاهده جزئیات پست' as any,
    UserType_delete = 'حذف پست' as any,
    UserType_list = 'مشاهده لیست پست' as any,


    City_create = 'ایجاد شهرستان' as any,
    City_update = 'ویرایش شهرستان' as any,
    // City_see = <any>'مشاهده جزئیات شهرستان',
    City_delete = 'حذف شهرستان' as any,
    City_list = 'مشاهده لیست شهرستان' as any,


    Province_create = 'ایجاد استان' as any,
    Province_update = 'ویرایش استان' as any,
    // Province_see = <any>'مشاهده جزئیات استان',
    Province_delete = 'حذف استان' as any,
    Province_list = 'مشاهده لیست استان' as any,

    Currency_create = 'ایجاد واحد پول' as any,
    Currency_delete = 'حذف واحد پول' as any,
    Currency_update = 'ویرایش واحد پول' as any,
    Currency_see = 'مشاهده جزئیات واحد پول' as any,
    Currency_list = 'مشاهده لیست  واحد پول ' as any,


    Budget_create = 'ایجاد بودجه' as any,
    Budget_update = 'ویرایش بودجه' as any,
    Budget_see = 'مشاهده جزئیات بودجه' as any,
    Budget_delete = 'حذف بودجه' as any,
    Budget_list = 'مشاهده لیست بودجه' as any,


    WorkOrderStatus_create = 'ایجاد وضعیت دستورکار' as any,
    WorkOrderStatus_update = 'ویرایش وضعیت دستورکار' as any,
    WorkOrderStatus_see = 'مشاهده جزئیات وضعیت دستورکار' as any,
    WorkOrderStatus_delete = 'حذف وضعیت دستورکار' as any,
    WorkOrderStatus_list = 'مشاهده لیست وضعیت دستورکار' as any,


    Measurement_create = 'ایجاد واحد اندازه گیری' as any,
    Measurement_update = 'ویرایش  واحد اندازه گیری' as any,
    Measurement_see = 'مشاهده جزئیات واحد اندازه گیری' as any,
    Measurement_delete = 'حذف واحد اندازه گیری' as any,
    Measurement_list = 'مشاهده لیست واحد اندازه گیری' as any,

    // مشخصات
    Property_create = 'ایجاد مشخصات' as any,
    Property_update = 'ویرایش مشخصات' as any,
    Property_see = 'مشاهده جزئیات مشخصات' as any,
    Property_delete = 'حذف مشخصات' as any,
    Property_list = 'مشاهده لیست مشخصات' as any,


    ///// دسته بندی  مشخصات
    PropertyCategory_create = 'ایجاد  دسته بندی مشخصات' as any,
    PropertyCategory_update = 'ویرایش  دسته بندی مشخصات' as any,
    PropertyCategory_see = 'مشاهده جزئیات  دسته بندی مشخصات' as any,
    PropertyCategory_delete = 'حذف  دسته بندی مشخصات' as any,
    PropertyCategory_list = 'مشاهده لیست  دسته بندی مشخصات' as any,


    Company_create = 'ایجاد شرکت' as any,
    Company_update = 'ویرایش شرکت' as any,
    Company_see = 'مشاهده جزئیات شرکت' as any,
    Company_delete = 'حذف شرکت' as any,
    Company_list = 'مشاهده لیست شرکت' as any,

    // سازمان ها
    // organization_create = <any>'ایجاد سازمان',
    // organization_update = <any>'ویرایش سازمان',
    // organization_see = <any>'مشاهده جزئیات سازمان',
    // organization_delete = <any>'حذف سازمان',
    // organization_list = <any>'مشاهده لیست سازمان ',

    Storage_create = 'ایجاد انبار' as any,
    Storage_update = 'ویرایش انبار' as any,
    Storage_see = 'مشاهده جزئیات انبار' as any,
    Storage_delete = 'حذف انبار' as any,
    Storage_list = 'مشاهده لیست انبار' as any,

    ChargeDepartment_create = 'ایجاد دپارتمان مسئول' as any,
    ChargeDepartment_update = 'ویرایش دپارتمان مسئول' as any,
    ChargeDepartment_see = 'مشاهده جزئیات دپارتمان مسئول' as any,
    ChargeDepartment_delete = 'حذف دپارتمان مسئول' as any,
    ChargeDepartment_list = 'مشاهده لیست دپارتمان مسئول' as any,

    assetCategory_create = 'ایجاد خانواده گروه دارایی' as any,
    assetCategory_update = 'ویرایش خانواده گروه دارایی' as any,
    assetCategory_see = 'مشاهده جزئیات خانواده گروه دارایی' as any,
    assetCategory_delete = 'حذف خانواده گروه دارایی' as any,
    assetCategory_list = 'مشاهده لیست خانواده گروه دارایی' as any,

    AssetTemplate_create = 'ایجاد قالب دارایی' as any,
    AssetTemplate_update = 'ویرایش قالب دارایی' as any,
    AssetTemplate_see = 'مشاهده جزئیات قالب دارایی' as any,
    AssetTemplate_delete = 'حذف قالب دارایی' as any,
    AssetTemplate_list = 'مشاهده لیست قالب دارایی' as any,

    Asset_create = 'ایجاد دارایی' as any,
    Asset_update = 'ویرایش دارایی' as any,
    Asset_see = 'مشاهده جزئیات دارایی' as any,
    Asset_delete = 'حذف دارایی' as any,
    Asset_list = 'مشاهده لیست دارایی' as any,

    Project_create = 'ایجاد پروژه' as any,
    Project_update = 'ویرایش پروژه' as any,
    Project_see = 'مشاهده جزئیات پروژه' as any,
    Project_delete = 'حذف پروژه' as any,
    Project_list = 'مشاهده لیست پروژه' as any,

    Scheduling_create = 'ایجاد زمانبندی' as any,
    Scheduling_update = 'ویرایش زمانبندی' as any,
    Scheduling_see = 'مشاهده جزئیات زمانبندی' as any,
    Scheduling_delete = 'حذف زمانبندی' as any,
    Scheduling_list = 'مشاهده لیست زمانبندی' as any,

    TaskGroup_create = 'ایجاد مجموعه کار' as any,
    TaskGroup_update = 'ویرایش مجموعه کار' as any,
    TaskGroup_see = 'مشاهده جزئیات مجموعه کار' as any,
    TaskGroup_delete = 'حذف مجموعه کار' as any,
    TaskGroup_list = 'مشاهده لیست مجموعه کار ' as any,

    Part_create = 'ایجاد قطعات' as any,
    Part_update = 'ویرایش قطعات' as any,
    Part_see = 'مشاهده جزئیات قطعات' as any,
    Part_delete = 'حذف قطعات' as any,
    Part_list = 'مشاهده لیست قطعات' as any,

    Inventory_create = 'ایجاد موجودی' as any,
    Inventory_see = 'مشاهده جزئیات موجودی' as any,
    Inventory_delete = 'حذف موجودی' as any,
    Inventory_list = 'مشاهده لیست موجودی' as any,

    AdjustInventory_create = 'ایجاد تنظیم موجودی' as any,
    // AdjustInventory_see = <any>'مشاهده جزئیات تنظیم موجودی',
    // AdjustInventory_delete = <any>'حذف تنظیم موجودی',
    // AdjustInventory_list = <any>'مشاهده لیست تنظیم موجودی',


    // کارتابل(برای یکسان سازی دسترسی ها به این صورت شدن)
    noticeBoard_see = 'مشاهده کارتابل ، فرآیند در انتظار تایید' as any,  // noticeBoardAll_see
    noticeBoard_create = 'مشاهده کارتابل ،  تاریخچه فرآیند اتمام نیافته' as any,    // noticeBoardActiveHistory_see
    noticeBoard_update = 'مشاهده کارتابل ،   تاریخچه فرآیند اتمام یافته' as any,  // noticeBoardInActiveHistory_see
    noticeBoard_awaiting_list_random = 'مشاهده لیست فرایند در انتظار تایید-تصادفی' as any,
    noticeBoard_awaiting_list_scheduling = 'مشاهده لیست فرایند در انتظار تایید-زمانبندی شده' as any,
    noticeBoard_active_list = 'مشاهده لیست تاریخچه فرآیند اتمام نیافته' as any,
    noticeBoard_completed_list = 'مشاهده لیست کارتابل تاریخچه فرآیند اتمام یافته' as any,


    // درخواست کار
    workRequest_create = 'ایجاد درخواست کار' as any,
    workRequest_see = 'مشاهده جزئیات درخواست کار' as any,
    // workRequest_send = 'ارسال درخواست تعمیر' as any,
    workRequest_delete = 'حذف درخواست کار' as any,
    workRequest_list = 'مشاهده لیست درخواست کار' as any,


    // دسته بندی فرم
    formCategory_create = 'ایجاد دسته بندی فرم' as any,
    formCategory_update = 'ویرایش دسته بندی فرم' as any,
    formCategory_see = 'مشاهده  جزئیات دسته بندی فرم' as any,
    formCategory_delete = 'حذف دسته بندی فرم' as any,
    formCategory_list = 'مشاهده لیست دسته بندی فرم' as any,


    // ساختار فنی ماشین آلات و تجهیزات
    BOM_create = 'ایجاد ' as any,
    BOM_update = 'ویرایش ' as any,
    BOM_see = 'مشاهده جزئیات ' as any,
    BOM_delete = 'حذف ' as any,
    BOM_list = 'مشاهده لیست ساختار فنی ماشین آلات و تجهیزات' as any,

    // فرم ساز
    formBuilder_create = 'ایجاد فرم' as any,
    formBuilder_edit = 'ویرایش فرم' as any,
    formBuilder_detail = 'مشاهده جزئیات فرم' as any,
    formBuilder_delete = 'حذف فرم' as any,
    formBuilder_list = 'مشاهده لیست فرم' as any,


// فرآیند ساز
    processBuilder_create = 'ایجاد فرآیند' as any,
    processBuilder_edit = 'حذف فرآیند' as any,
    processBuilder_detail = 'مشاهده جزئیات فرآیند' as any,
    processBuilder_delete = 'ویرایش فرآیند' as any,
    processBuilder_list = 'مشاهده لیست فرآیند' as any,


// متراژ خوانی
    metering_create = 'ایجاد متراژ خوانی' as any,
    metering_detail = 'مشاهده جزئیات متراژ خوانی' as any,
    metering_list = 'مشاهده لیست متراژ خوانی' as any,


    // پیام رسان
    message_received_Detail = 'مشاهده پیام های دریافتی' as any,
    message_Delete_Detail = 'مشاهده پیام های حذف شده' as any,
    message_system_Detail = 'مشاهده پیام های سیستمی' as any,
    message_sender_Detail = 'مشاهده پیام های ارسالی' as any,

    message_received_Delete = 'حذف پیام های دریافتی' as any,
    message_Delete_Delete = 'حذف پیام های حذف شده' as any,
    message_system_Delete = 'حذف پیام های سیستمی' as any,
    message_sender_Delete = 'حذف پیام های ارسالی' as any,

    message_received_list = 'مشاهده لیست پیام های دریافتی' as any,
    message_Delete_list = 'مشاهده لیست پیام های حذف شده' as any,
    message_system_list = 'مشاهده لیست پیام های سیستمی' as any,
    message_sender_list = 'مشاهده لیست پیام های ارسالی' as any,

    message_send = 'ارسال پیام' as any,
    // دارایی تخصیص یافته
    AssignedAsset_update = 'ویرایش دارایی تخصیص یافته' as any,
    AssignedAsset_see = 'مشاهده جزئیات دارایی تخصیص یافته' as any,
    AssignedAsset_list = 'مشاهده لیست دارایی تخصیص یافته' as any,


    // قطعات تخصیص یافته
    AssignedPart_update = 'ویرایش قطعات تخصیص یافته' as any,
    AssignedPart_see = 'مشاهده جزئیات قطعات تخصیص یافته' as any,
    AssignedPart_list = 'مشاهده لیست قطعات تخصیص یافته' as any,

    // دستور کار تخصیص یافته
    AssignedWorkOrder_update = 'ویرایش دستورکارتخصیص یافته' as any,
    AssignedWorkOrder_see = 'مشاهده جزئیات دستورکارتخصیص یافته' as any,
    AssignedWorkOrder_list = 'مشاهده لیست دستورکارتخصیص یافته' as any,
// گزارش گیری
    Report_usedPart = ' قطعات مصرفی' as any,
    Report_personnelWorkTime = ' کارکرد پرسنل' as any,
    Report_keyPerformanceIndicator = ' شاخصهای قابلیت اطمینان' as any,


    // نوع فعایت
    TypeOfActivity_create = '  ایجاد ' as any,
    TypeOfActivity_list = '  لیست ' as any,
    TypeOfActivity_update = '  ویرایش ' as any,
    TypeOfActivity_Delete = '  حذف ' as any,

// رسته کاری
    WorkingField_create = ' ایجاد ' as any,
    WorkingField_list = ' لیست ' as any,
    WorkingField_update = ' ویرایش ' as any,
    WorkingField_Delete = ' حذف ' as any,


// درجه اهمیت
    DegreeOfImportance_create = 'ایجاد' as any,
    DegreeOfImportance_list = 'لیست ' as any,
    DegreeOfImportance_update = 'ویرایش************** ' as any,
    DegreeOfImportance_Delete = 'حذف ' as any,


    WorkOrderRandom_list = 'مشاهده لیست ' as any,
    WorkOrderRandom_see = 'مشاهده جزئیات' as any,
    WorkOrderRandom_update = 'ویرایش' as any,
    WorkOrderRandom_delete = 'حذف' as any,

    WorkOrderScheduling_list = 'مشاهده لیست' as any,
    WorkOrderScheduling_see = 'مشاهده جزئیات ' as any,
    WorkOrderScheduling_update = 'ویرایش ' as any,
    WorkOrderScheduling_delete = 'حذف ' as any,
// روانکارها
    Lubricant_create = 'ایجاد' as any,
    Lubricant_list = 'لیست' as any,
    Lubricant_update = 'ویرایش' as any,
    Lubricant_Delete = 'حذف' as any,

}

export enum AccessController1 {
    Home_see = 'مشاهده صفحه خانه ' as any,
    calender_see = 'مشاهده ' as any,


    User_create = 'ایجاد کاربر' as any,
    User_update = 'ویرایش کاربر' as any,
    User_see = 'مشاهده جزئیات کاربر' as any,
    User_delete = 'حذف کاربر' as any,
    User_list = 'مشاهده لیست کاربر' as any,

    UserType_create = 'ایجاد پست' as any,
    UserType_update = 'ویرایش پست' as any,
    // UserType_see = 'مشاهده جزئیات پست' as any,
    UserType_delete = 'حذف پست' as any,
    UserType_list = 'مشاهده لیست پست' as any,


    City_create = 'ایجاد شهرستان' as any,
    City_update = 'ویرایش شهرستان' as any,
    // City_see = <any>'مشاهده جزئیات شهرستان',
    City_delete = 'حذف شهرستان' as any,
    City_list = 'مشاهده لیست شهرستان' as any,


    Province_create = 'ایجاد استان' as any,
    Province_update = 'ویرایش استان' as any,
    // Province_see = <any>'مشاهده جزئیات استان',
    Province_delete = 'حذف استان' as any,
    Province_list = 'مشاهده لیست استان' as any,

    Currency_create = 'ایجاد واحد پول' as any,
    Currency_delete = 'حذف واحد پول' as any,
    Currency_update = 'ویرایش واحد پول' as any,
    Currency_see = 'مشاهده جزئیات واحد پول' as any,
    Currency_list = 'مشاهده لیست  واحد پول ' as any,


    Budget_create = 'ایجاد بودجه' as any,
    Budget_update = 'ویرایش بودجه' as any,
    Budget_see = 'مشاهده جزئیات بودجه' as any,
    Budget_delete = 'حذف بودجه' as any,
    Budget_list = 'مشاهده لیست بودجه' as any,


    WorkOrderStatus_create = 'ایجاد وضعیت دستورکار' as any,
    WorkOrderStatus_update = 'ویرایش وضعیت دستورکار' as any,
    WorkOrderStatus_see = 'مشاهده جزئیات وضعیت دستورکار' as any,
    WorkOrderStatus_delete = 'حذف وضعیت دستورکار' as any,
    WorkOrderStatus_list = 'مشاهده لیست وضعیت دستورکار' as any,


    Measurement_create = 'ایجاد واحد اندازه گیری' as any,
    Measurement_update = 'ویرایش  واحد اندازه گیری' as any,
    Measurement_see = 'مشاهده جزئیات واحد اندازه گیری' as any,
    Measurement_delete = 'حذف واحد اندازه گیری' as any,
    Measurement_list = 'مشاهده لیست واحد اندازه گیری' as any,

    // مشخصات
    Property_create = 'ایجاد مشخصات' as any,
    Property_update = 'ویرایش مشخصات' as any,
    Property_see = 'مشاهده جزئیات مشخصات' as any,
    Property_delete = 'حذف مشخصات' as any,
    Property_list = 'مشاهده لیست مشخصات' as any,


    ///// دسته بندی  مشخصات
    PropertyCategory_create = 'ایجاد  دسته بندی مشخصات' as any,
    PropertyCategory_update = 'ویرایش  دسته بندی مشخصات' as any,
    PropertyCategory_see = 'مشاهده جزئیات  دسته بندی مشخصات' as any,
    PropertyCategory_delete = 'حذف  دسته بندی مشخصات' as any,
    PropertyCategory_list = 'مشاهده لیست  دسته بندی مشخصات' as any,


    Company_create = 'ایجاد شرکت' as any,
    Company_update = 'ویرایش شرکت' as any,
    Company_see = 'مشاهده جزئیات شرکت' as any,
    Company_delete = 'حذف شرکت' as any,
    Company_list = 'مشاهده لیست شرکت' as any,

}


export class AccessController2 {

    Home_see = 'مشاهده صفحه خانه ';
    calender_see = 'مشاهده ';


    User_create = 'ایجاد کاربر';
    User_update = 'ویرایش کاربر';
    User_see = 'مشاهده جزئیات کاربر';
    User_delete = 'حذف کاربر';
    User_list = 'مشاهده لیست کاربر';

    UserType_create = 'ایجاد پست';
    UserType_update = 'ویرایش پست';
    // UserType_see = 'مشاهده جزئیات پست' ;
    UserType_delete = 'حذف پست';
    UserType_list = 'مشاهده لیست پست';


    City_create = 'ایجاد شهرستان';
    City_update = 'ویرایش شهرستان';
    // City_see = <any>'مشاهده جزئیات شهرستان',
    City_delete = 'حذف شهرستان';
    City_list = 'مشاهده لیست شهرستان';


    Province_create = 'ایجاد استان';
    Province_update = 'ویرایش استان';
    // Province_see = <any>'مشاهده جزئیات استان',
    Province_delete = 'حذف استان';
    Province_list = 'مشاهده لیست استان';

    Currency_create = 'ایجاد واحد پول';
    Currency_delete = 'حذف واحد پول';
    Currency_update = 'ویرایش واحد پول';
    Currency_see = 'مشاهده جزئیات واحد پول';
    Currency_list = 'مشاهده لیست  واحد پول ';


    Budget_create = 'ایجاد بودجه';
    Budget_update = 'ویرایش بودجه';
    Budget_see = 'مشاهده جزئیات بودجه';
    Budget_delete = 'حذف بودجه';
    Budget_list = 'مشاهده لیست بودجه';


    WorkOrderStatus_create = 'ایجاد وضعیت دستورکار';
    WorkOrderStatus_update = 'ویرایش وضعیت دستورکار';
    WorkOrderStatus_see = 'مشاهده جزئیات وضعیت دستورکار';
    WorkOrderStatus_delete = 'حذف وضعیت دستورکار';
    WorkOrderStatus_list = 'مشاهده لیست وضعیت دستورکار';


    Measurement_create = 'ایجاد واحد اندازه گیری';
    Measurement_update = 'ویرایش  واحد اندازه گیری';
    Measurement_see = 'مشاهده جزئیات واحد اندازه گیری';
    Measurement_delete = 'حذف واحد اندازه گیری';
    Measurement_list = 'مشاهده لیست واحد اندازه گیری';

    // مشخصات
    Property_create = 'ایجاد مشخصات';
    Property_update = 'ویرایش مشخصات';
    Property_see = 'مشاهده جزئیات مشخصات';
    Property_delete = 'حذف مشخصات';
    Property_list = 'مشاهده لیست مشخصات';


    ///// دسته بندی  مشخصات
    PropertyCategory_create = 'ایجاد  دسته بندی مشخصات';
    PropertyCategory_update = 'ویرایش  دسته بندی مشخصات';
    PropertyCategory_see = 'مشاهده جزئیات  دسته بندی مشخصات';
    PropertyCategory_delete = 'حذف  دسته بندی مشخصات';
    PropertyCategory_list = 'مشاهده لیست  دسته بندی مشخصات';


    Company_create = 'ایجاد شرکت';
    Company_update = 'ویرایش شرکت';
    Company_see = 'مشاهده جزئیات شرکت';
    Company_delete = 'حذف شرکت';
    Company_list = 'مشاهده لیست شرکت';

    // سازمان ها
    // organization_create = <any>'ایجاد سازمان',
    // organization_update = <any>'ویرایش سازمان',
    // organization_see = <any>'مشاهده جزئیات سازمان',
    // organization_delete = <any>'حذف سازمان',
    // organization_list = <any>'مشاهده لیست سازمان ',

    Storage_create = 'ایجاد انبار';
    Storage_update = 'ویرایش انبار';
    Storage_see = 'مشاهده جزئیات انبار';
    Storage_delete = 'حذف انبار';
    Storage_list = 'مشاهده لیست انبار';

    ChargeDepartment_create = 'ایجاد دپارتمان مسئول';
    ChargeDepartment_update = 'ویرایش دپارتمان مسئول';
    ChargeDepartment_see = 'مشاهده جزئیات دپارتمان مسئول';
    ChargeDepartment_delete = 'حذف دپارتمان مسئول';
    ChargeDepartment_list = 'مشاهده لیست دپارتمان مسئول';

    assetCategory_create = 'ایجاد خانواده گروه دارایی';
    assetCategory_update = 'ویرایش خانواده گروه دارایی';
    assetCategory_see = 'مشاهده جزئیات خانواده گروه دارایی';
    assetCategory_delete = 'حذف خانواده گروه دارایی';
    assetCategory_list = 'مشاهده لیست خانواده گروه دارایی';

    AssetTemplate_create = 'ایجاد قالب دارایی';
    AssetTemplate_update = 'ویرایش قالب دارایی';
    AssetTemplate_see = 'مشاهده جزئیات قالب دارایی';
    AssetTemplate_delete = 'حذف قالب دارایی';
    AssetTemplate_list = 'مشاهده لیست قالب دارایی';

    Asset_create = 'ایجاد دارایی';
    Asset_update = 'ویرایش دارایی';
    Asset_see = 'مشاهده جزئیات دارایی';
    Asset_delete = 'حذف دارایی';
    Asset_list = 'مشاهده لیست دارایی';

    Project_create = 'ایجاد پروژه';
    Project_update = 'ویرایش پروژه';
    Project_see = 'مشاهده جزئیات پروژه';
    Project_delete = 'حذف پروژه';
    Project_list = 'مشاهده لیست پروژه';

    Scheduling_create = 'ایجاد زمانبندی';
    Scheduling_update = 'ویرایش زمانبندی';
    Scheduling_see = 'مشاهده جزئیات زمانبندی';
    Scheduling_delete = 'حذف زمانبندی';
    Scheduling_list = 'مشاهده لیست زمانبندی';

    TaskGroup_create = 'ایجاد مجموعه کار';
    TaskGroup_update = 'ویرایش مجموعه کار';
    TaskGroup_see = 'مشاهده جزئیات مجموعه کار';
    TaskGroup_delete = 'حذف مجموعه کار';
    TaskGroup_list = 'مشاهده لیست مجموعه کار ';

    Part_create = 'ایجاد قطعات';
    Part_update = 'ویرایش قطعات';
    Part_see = 'مشاهده جزئیات قطعات';
    Part_delete = 'حذف قطعات';
    Part_list = 'مشاهده لیست قطعات';

    Inventory_create = 'ایجاد موجودی';
    Inventory_see = 'مشاهده جزئیات موجودی';
    Inventory_delete = 'حذف موجودی';
    Inventory_list = 'مشاهده لیست موجودی';

    AdjustInventory_create = 'ایجاد تنظیم موجودی';
    // AdjustInventory_see = <any>'مشاهده جزئیات تنظیم موجودی',
    // AdjustInventory_delete = <any>'حذف تنظیم موجودی',
    // AdjustInventory_list = <any>'مشاهده لیست تنظیم موجودی',


    // کارتابل(برای یکسان سازی دسترسی ها به این صورت شدن)
    noticeBoard_see = 'مشاهده کارتابل ، فرآیند در انتظار تایید';  // noticeBoardAll_see
    noticeBoard_create = 'مشاهده کارتابل ،  تاریخچه فرآیند اتمام نیافته';    // noticeBoardActiveHistory_see
    noticeBoard_update = 'مشاهده کارتابل ،   تاریخچه فرآیند اتمام یافته';  // noticeBoardInActiveHistory_see
    noticeBoard_awaiting_list_random = 'مشاهده لیست فرایند در انتظار تایید-تصادفی';
    noticeBoard_awaiting_list_scheduling = 'مشاهده لیست فرایند در انتظار تایید-زمانبندی شده';
    noticeBoard_active_list = 'مشاهده لیست تاریخچه فرآیند اتمام نیافته';
    noticeBoard_completed_list = 'مشاهده لیست کارتابل تاریخچه فرآیند اتمام یافته';


    // درخواست کار
    workRequest_create = 'ایجاد درخواست کار';
    workRequest_see = 'مشاهده جزئیات درخواست کار';
    // workRequest_send = 'ارسال درخواست تعمیر' ;
    workRequest_delete = 'حذف درخواست کار';
    workRequest_list = 'مشاهده لیست درخواست کار';


    // دسته بندی فرم
    formCategory_create = 'ایجاد دسته بندی فرم';
    formCategory_update = 'ویرایش دسته بندی فرم';
    formCategory_see = 'مشاهده  جزئیات دسته بندی فرم';
    formCategory_delete = 'حذف دسته بندی فرم';
    formCategory_list = 'مشاهده لیست دسته بندی فرم';


    // ساختار فنی ماشین آلات و تجهیزات
    BOM_create = 'ایجاد ';
    BOM_update = 'ویرایش ';
    BOM_see = 'مشاهده جزئیات ';
    BOM_delete = 'حذف ';
    BOM_list = 'مشاهده لیست ساختار فنی ماشین آلات و تجهیزات';

    // فرم ساز
    formBuilder_create = 'ایجاد فرم';
    formBuilder_edit = 'ویرایش فرم';
    formBuilder_detail = 'مشاهده جزئیات فرم';
    formBuilder_delete = 'حذف فرم';
    formBuilder_list = 'مشاهده لیست فرم';


// فرآیند ساز
    processBuilder_create = 'ایجاد فرآیند';
    processBuilder_edit = 'حذف فرآیند';
    processBuilder_detail = 'مشاهده جزئیات فرآیند';
    processBuilder_delete = 'ویرایش فرآیند';
    processBuilder_list = 'مشاهده لیست فرآیند';


// متراژ خوانی
    metering_create = 'ایجاد متراژ خوانی';
    metering_detail = 'مشاهده جزئیات متراژ خوانی';
    metering_list = 'مشاهده لیست متراژ خوانی';


    // پیام رسان
    message_received_Detail = 'مشاهده پیام های دریافتی';
    message_Delete_Detail = 'مشاهده پیام های حذف شده';
    message_system_Detail = 'مشاهده پیام های سیستمی';
    message_sender_Detail = 'مشاهده پیام های ارسالی';

    message_received_Delete = 'حذف پیام های دریافتی';
    message_Delete_Delete = 'حذف پیام های حذف شده';
    message_system_Delete = 'حذف پیام های سیستمی';
    message_sender_Delete = 'حذف پیام های ارسالی';

    message_received_list = 'مشاهده لیست پیام های دریافتی';
    message_Delete_list = 'مشاهده لیست پیام های حذف شده';
    message_system_list = 'مشاهده لیست پیام های سیستمی';
    message_sender_list = 'مشاهده لیست پیام های ارسالی';

    message_send = 'ارسال پیام';
    // دارایی تخصیص یافته
    AssignedAsset_update = 'ویرایش دارایی تخصیص یافته';
    AssignedAsset_see = 'مشاهده جزئیات دارایی تخصیص یافته';
    AssignedAsset_list = 'مشاهده لیست دارایی تخصیص یافته';


    // قطعات تخصیص یافته
    AssignedPart_update = 'ویرایش قطعات تخصیص یافته';
    AssignedPart_see = 'مشاهده جزئیات قطعات تخصیص یافته';
    AssignedPart_list = 'مشاهده لیست قطعات تخصیص یافته';

    // دستور کار تخصیص یافته
    AssignedWorkOrder_update = 'ویرایش دستورکارتخصیص یافته';
    AssignedWorkOrder_see = 'مشاهده جزئیات دستورکارتخصیص یافته';
    AssignedWorkOrder_list = 'مشاهده لیست دستورکارتخصیص یافته';
// گزارش گیری
    Report_usedPart = ' قطعات مصرفی';
    Report_personnelWorkTime = ' کارکرد پرسنل';
    Report_keyPerformanceIndicator = ' شاخصهای قابلیت اطمینان';


    // نوع فعایت
    TypeOfActivity_create = '  ایجاد ';
    TypeOfActivity_list = '  لیست ';
    TypeOfActivity_update = '  ویرایش ';
    TypeOfActivity_Delete = '  حذف ';

// رسته کاری
    WorkingField_create = ' ایجاد ';
    WorkingField_list = ' لیست ';
    WorkingField_update = ' ویرایش ';
    WorkingField_Delete = ' حذف ';


// درجه اهمیت
    DegreeOfImportance_create = 'ایجاد';
    DegreeOfImportance_list = 'لیست ';
    DegreeOfImportance_update = 'ویرایش ';
    DegreeOfImportance_Delete = 'حذف ';


    WorkOrderRandom_list = 'مشاهده لیست ';
    WorkOrderRandom_see = 'مشاهده جزئیات';
    WorkOrderRandom_update = 'ویرایش';
    WorkOrderRandom_delete = 'حذف';

    WorkOrderScheduling_list = 'مشاهده لیست';
    WorkOrderScheduling_see = 'مشاهده جزئیات ';
    WorkOrderScheduling_update = 'ویرایش ';
    WorkOrderScheduling_delete = 'حذف ';
// روانکارها
    Lubricant_create = 'ایجاد';
    Lubricant_list = 'لیست';
    Lubricant_update = 'ویرایش';
    Lubricant_Delete = 'حذف';

}


// export enum EnumCrudTitle {
//     DELETE = 'حذف',
//
//     SEE = 'مشاهده جزئیات',
// }

export class AccessControllerClass {
    public static deleteTitle = 'حذف';
}

// export class AccessControllerClass {
//     public static ControllerArray = [
//         // خانه
//         {
//             _title: 'مشاهده صفحه خانه ',
//             _value: 'Home_see '
//         },
//         // تقویم
//         {
//             _title: 'مشاهده  ',
//             _value: 'calender_see '
//         },
//         // تقویم
//         {
//             _title: 'مشاهده  ',
//             _value: 'calender_see '
//         },
//     ];
//
// }

// {
//     Home_see = 'مشاهده صفحه خانه ' as any,
//     calender_see = 'مشاهده ' as any,
//
//
//     User_create = 'ایجاد کاربر' as any,
//     User_update = 'ویرایش کاربر' as any,
//     User_see = 'مشاهده جزئیات کاربر' as any,
//     User_delete = 'حذف کاربر' as any,
//     User_list = 'مشاهده لیست کاربر' as any,
//
//     UserType_create = 'ایجاد پست' as any,
//     UserType_update = 'ویرایش پست' as any,
//     // UserType_see = 'مشاهده جزئیات پست' as any,
//     UserType_delete = 'حذف پست' as any,
//     UserType_list = 'مشاهده لیست پست' as any,
//
//
//     City_create = 'ایجاد شهرستان' as any,
//     City_update = 'ویرایش شهرستان' as any,
//     // City_see = <any>'مشاهده جزئیات شهرستان',
//     City_delete = 'حذف شهرستان' as any,
//     City_list = 'مشاهده لیست شهرستان' as any,
//
//
//     Province_create = 'ایجاد استان' as any,
//     Province_update = 'ویرایش استان' as any,
//     // Province_see = <any>'مشاهده جزئیات استان',
//     Province_delete = 'حذف استان' as any,
//     Province_list = 'مشاهده لیست استان' as any,
//
//     Currency_create = 'ایجاد واحد پول' as any,
//     Currency_delete = 'حذف واحد پول' as any,
//     Currency_update = 'ویرایش واحد پول' as any,
//     Currency_see = 'مشاهده جزئیات واحد پول' as any,
//     Currency_list = 'مشاهده لیست  واحد پول ' as any,
//
//
//     Budget_create = 'ایجاد بودجه' as any,
//     Budget_update = 'ویرایش بودجه' as any,
//     Budget_see = 'مشاهده جزئیات بودجه' as any,
//     Budget_delete = 'حذف بودجه' as any,
//     Budget_list = 'مشاهده لیست بودجه' as any,
//
//
//     WorkOrderStatus_create = 'ایجاد وضعیت دستورکار' as any,
//     WorkOrderStatus_update = 'ویرایش وضعیت دستورکار' as any,
//     WorkOrderStatus_see = 'مشاهده جزئیات وضعیت دستورکار' as any,
//     WorkOrderStatus_delete = 'حذف وضعیت دستورکار' as any,
//     WorkOrderStatus_list = 'مشاهده لیست وضعیت دستورکار' as any,
//
//
//     Measurement_create = 'ایجاد واحد اندازه گیری' as any,
//     Measurement_update = 'ویرایش  واحد اندازه گیری' as any,
//     Measurement_see = 'مشاهده جزئیات واحد اندازه گیری' as any,
//     Measurement_delete = 'حذف واحد اندازه گیری' as any,
//     Measurement_list = 'مشاهده لیست واحد اندازه گیری' as any,
//
//     // مشخصات
//     Property_create = 'ایجاد مشخصات' as any,
//     Property_update = 'ویرایش مشخصات' as any,
//     Property_see = 'مشاهده جزئیات مشخصات' as any,
//     Property_delete = 'حذف مشخصات' as any,
//     Property_list = 'مشاهده لیست مشخصات' as any,
//
//
//     ///// دسته بندی  مشخصات
//     PropertyCategory_create = 'ایجاد  دسته بندی مشخصات' as any,
//     PropertyCategory_update = 'ویرایش  دسته بندی مشخصات' as any,
//     PropertyCategory_see = 'مشاهده جزئیات  دسته بندی مشخصات' as any,
//     PropertyCategory_delete = 'حذف  دسته بندی مشخصات' as any,
//     PropertyCategory_list = 'مشاهده لیست  دسته بندی مشخصات' as any,
//
//
//     Company_create = 'ایجاد شرکت' as any,
//     Company_update = 'ویرایش شرکت' as any,
//     Company_see = 'مشاهده جزئیات شرکت' as any,
//     Company_delete = 'حذف شرکت' as any,
//     Company_list = 'مشاهده لیست شرکت' as any,
//
//     // سازمان ها
//     // organization_create = <any>'ایجاد سازمان',
//     // organization_update = <any>'ویرایش سازمان',
//     // organization_see = <any>'مشاهده جزئیات سازمان',
//     // organization_delete = <any>'حذف سازمان',
//     // organization_list = <any>'مشاهده لیست سازمان ',
//
//     Storage_create = 'ایجاد انبار' as any,
//     Storage_update = 'ویرایش انبار' as any,
//     Storage_see = 'مشاهده جزئیات انبار' as any,
//     Storage_delete = 'حذف انبار' as any,
//     Storage_list = 'مشاهده لیست انبار' as any,
//
//     ChargeDepartment_create = 'ایجاد دپارتمان مسئول' as any,
//     ChargeDepartment_update = 'ویرایش دپارتمان مسئول' as any,
//     ChargeDepartment_see = 'مشاهده جزئیات دپارتمان مسئول' as any,
//     ChargeDepartment_delete = 'حذف دپارتمان مسئول' as any,
//     ChargeDepartment_list = 'مشاهده لیست دپارتمان مسئول' as any,
//
//     assetCategory_create = 'ایجاد خانواده گروه دارایی' as any,
//     assetCategory_update = 'ویرایش خانواده گروه دارایی' as any,
//     assetCategory_see = 'مشاهده جزئیات خانواده گروه دارایی' as any,
//     assetCategory_delete = 'حذف خانواده گروه دارایی' as any,
//     assetCategory_list = 'مشاهده لیست خانواده گروه دارایی' as any,
//
//     AssetTemplate_create = 'ایجاد قالب دارایی' as any,
//     AssetTemplate_update = 'ویرایش قالب دارایی' as any,
//     AssetTemplate_see = 'مشاهده جزئیات قالب دارایی' as any,
//     AssetTemplate_delete = 'حذف قالب دارایی' as any,
//     AssetTemplate_list = 'مشاهده لیست قالب دارایی' as any,
//
//     Asset_create = 'ایجاد دارایی' as any,
//     Asset_update = 'ویرایش دارایی' as any,
//     Asset_see = 'مشاهده جزئیات دارایی' as any,
//     Asset_delete = 'حذف دارایی' as any,
//     Asset_list = 'مشاهده لیست دارایی' as any,
//
//     Project_create = 'ایجاد پروژه' as any,
//     Project_update = 'ویرایش پروژه' as any,
//     Project_see = 'مشاهده جزئیات پروژه' as any,
//     Project_delete = 'حذف پروژه' as any,
//     Project_list = 'مشاهده لیست پروژه' as any,
//
//     Scheduling_create = 'ایجاد زمانبندی' as any,
//     Scheduling_update = 'ویرایش زمانبندی' as any,
//     Scheduling_see = 'مشاهده جزئیات زمانبندی' as any,
//     Scheduling_delete = 'حذف زمانبندی' as any,
//     Scheduling_list = 'مشاهده لیست زمانبندی' as any,
//
//     TaskGroup_create = 'ایجاد مجموعه کار' as any,
//     TaskGroup_update = 'ویرایش مجموعه کار' as any,
//     TaskGroup_see = 'مشاهده جزئیات مجموعه کار' as any,
//     TaskGroup_delete = 'حذف مجموعه کار' as any,
//     TaskGroup_list = 'مشاهده لیست مجموعه کار ' as any,
//
//     Part_create = 'ایجاد قطعات' as any,
//     Part_update = 'ویرایش قطعات' as any,
//     Part_see = 'مشاهده جزئیات قطعات' as any,
//     Part_delete = 'حذف قطعات' as any,
//     Part_list = 'مشاهده لیست قطعات' as any,
//
//     Inventory_create = 'ایجاد موجودی' as any,
//     Inventory_see = 'مشاهده جزئیات موجودی' as any,
//     Inventory_delete = 'حذف موجودی' as any,
//     Inventory_list = 'مشاهده لیست موجودی' as any,
//
//     AdjustInventory_create = 'ایجاد تنظیم موجودی' as any,
//     // AdjustInventory_see = <any>'مشاهده جزئیات تنظیم موجودی',
//     // AdjustInventory_delete = <any>'حذف تنظیم موجودی',
//     // AdjustInventory_list = <any>'مشاهده لیست تنظیم موجودی',
//
//
//     // کارتابل(برای یکسان سازی دسترسی ها به این صورت شدن)
//     noticeBoard_see = 'مشاهده کارتابل ، فرآیند در انتظار تایید' as any,  // noticeBoardAll_see
//     noticeBoard_create = 'مشاهده کارتابل ،  تاریخچه فرآیند اتمام نیافته' as any,    // noticeBoardActiveHistory_see
//     noticeBoard_update = 'مشاهده کارتابل ،   تاریخچه فرآیند اتمام یافته' as any,  // noticeBoardInActiveHistory_see
//     noticeBoard_awaiting_list_random = 'مشاهده لیست فرایند در انتظار تایید-تصادفی' as any,
//     noticeBoard_awaiting_list_scheduling = 'مشاهده لیست فرایند در انتظار تایید-زمانبندی شده' as any,
//     noticeBoard_active_list = 'مشاهده لیست تاریخچه فرآیند اتمام نیافته' as any,
//     noticeBoard_completed_list = 'مشاهده لیست کارتابل تاریخچه فرآیند اتمام یافته' as any,
//
//
//     // درخواست کار
//     workRequest_create = 'ایجاد درخواست کار' as any,
//     workRequest_see = 'مشاهده جزئیات درخواست کار' as any,
//     // workRequest_send = 'ارسال درخواست تعمیر' as any,
//     workRequest_delete = 'حذف درخواست کار' as any,
//     workRequest_list = 'مشاهده لیست درخواست کار' as any,
//
//
//     // دسته بندی فرم
//     formCategory_create = 'ایجاد دسته بندی فرم' as any,
//     formCategory_update = 'ویرایش دسته بندی فرم' as any,
//     formCategory_see = 'مشاهده  جزئیات دسته بندی فرم' as any,
//     formCategory_delete = 'حذف دسته بندی فرم' as any,
//     formCategory_list = 'مشاهده لیست دسته بندی فرم' as any,
//
//
//     // ساختار فنی ماشین آلات و تجهیزات
//     BOM_create = 'ایجاد ' as any,
//     BOM_update = 'ویرایش ' as any,
//     BOM_see = 'مشاهده جزئیات ' as any,
//     BOM_delete = 'حذف ' as any,
//     BOM_list = 'مشاهده لیست ساختار فنی ماشین آلات و تجهیزات' as any,
//
//     // فرم ساز
//     formBuilder_create = 'ایجاد فرم' as any,
//     formBuilder_edit = 'ویرایش فرم' as any,
//     formBuilder_detail = 'مشاهده جزئیات فرم' as any,
//     formBuilder_delete = 'حذف فرم' as any,
//     formBuilder_list = 'مشاهده لیست فرم' as any,
//
//
// // فرآیند ساز
//     processBuilder_create = 'ایجاد فرآیند' as any,
//     processBuilder_edit = 'حذف فرآیند' as any,
//     processBuilder_detail = 'مشاهده جزئیات فرآیند' as any,
//     processBuilder_delete = 'ویرایش فرآیند' as any,
//     processBuilder_list = 'مشاهده لیست فرآیند' as any,
//
//
// // متراژ خوانی
//     metering_create = 'ایجاد متراژ خوانی' as any,
//     metering_detail = 'مشاهده جزئیات متراژ خوانی' as any,
//     metering_list = 'مشاهده لیست متراژ خوانی' as any,
//
//
//     // پیام رسان
//     message_received_Detail = 'مشاهده پیام های دریافتی' as any,
//     message_Delete_Detail = 'مشاهده پیام های حذف شده' as any,
//     message_system_Detail = 'مشاهده پیام های سیستمی' as any,
//     message_sender_Detail = 'مشاهده پیام های ارسالی' as any,
//
//     message_received_Delete = 'حذف پیام های دریافتی' as any,
//     message_Delete_Delete = 'حذف پیام های حذف شده' as any,
//     message_system_Delete = 'حذف پیام های سیستمی' as any,
//     message_sender_Delete = 'حذف پیام های ارسالی' as any,
//
//     message_received_list = 'مشاهده لیست پیام های دریافتی' as any,
//     message_Delete_list = 'مشاهده لیست پیام های حذف شده' as any,
//     message_system_list = 'مشاهده لیست پیام های سیستمی' as any,
//     message_sender_list = 'مشاهده لیست پیام های ارسالی' as any,
//
//     message_send = 'ارسال پیام' as any,
//     // دارایی تخصیص یافته
//     AssignedAsset_update = 'ویرایش دارایی تخصیص یافته' as any,
//     AssignedAsset_see = 'مشاهده جزئیات دارایی تخصیص یافته' as any,
//     AssignedAsset_list = 'مشاهده لیست دارایی تخصیص یافته' as any,
//
//
//     // قطعات تخصیص یافته
//     AssignedPart_update = 'ویرایش قطعات تخصیص یافته' as any,
//     AssignedPart_see = 'مشاهده جزئیات قطعات تخصیص یافته' as any,
//     AssignedPart_list = 'مشاهده لیست قطعات تخصیص یافته' as any,
//
//     // دستور کار تخصیص یافته
//     AssignedWorkOrder_update = 'ویرایش دستورکارتخصیص یافته' as any,
//     AssignedWorkOrder_see = 'مشاهده جزئیات دستورکارتخصیص یافته' as any,
//     AssignedWorkOrder_list = 'مشاهده لیست دستورکارتخصیص یافته' as any,
// // گزارش گیری
//     Report_usedPart = ' قطعات مصرفی' as any,
//     Report_personnelWorkTime = ' کارکرد پرسنل' as any,
//     Report_keyPerformanceIndicator = ' شاخصهای قابلیت اطمینان' as any,
//
//
//     // نوع فعایت
//     TypeOfActivity_create = '  ایجاد ' as any,
//     TypeOfActivity_list = '  لیست ' as any,
//     TypeOfActivity_update = '  ویرایش ' as any,
//     TypeOfActivity_Delete = '  حذف ' as any,
//
// // رسته کاری
//     WorkingField_create = ' ایجاد ' as any,
//     WorkingField_list = ' لیست ' as any,
//     WorkingField_update = ' ویرایش ' as any,
//     WorkingField_Delete = ' حذف ' as any,
//
//
// // درجه اهمیت
//     DegreeOfImportance_create = 'ایجاد' as any,
//     DegreeOfImportance_list = 'لیست ' as any,
//     DegreeOfImportance_update = 'ویرایش ' as any,
//     DegreeOfImportance_Delete = 'حذف ' as any,
//
//
//     WorkOrderRandom_list = 'مشاهده لیست ' as any,
//     WorkOrderRandom_see = 'مشاهده جزئیات' as any,
//     WorkOrderRandom_update = 'ویرایش' as any,
//     WorkOrderRandom_delete = 'حذف' as any,
//
//     WorkOrderScheduling_list = 'مشاهده لیست' as any,
//     WorkOrderScheduling_see = 'مشاهده جزئیات ' as any,
//     WorkOrderScheduling_update = 'ویرایش ' as any,
//     WorkOrderScheduling_delete = 'حذف ' as any,
// // روانکارها
//     Lubricant_create = 'ایجاد' as any,
//     Lubricant_list = 'لیست' as any,
//     Lubricant_update = 'ویرایش' as any,
//     Lubricant_Delete = 'حذف' as any,
//
// }
