export enum PlanReportType {
  REPORT_PLAN_TYPE = <any> 'نمودار سالانه برنامه ها بر پایه تعداد انواع برنامه ها',
  REPORT_PLAN_TYPE_YEAR = <any> 'نمودار نوع برنامه انتخابی بر پایه تعداد در هر سال',
  REPORT_PLAN_TYPE_MONTH = <any> 'نمودار سالانه نوع برنامه انتخابی بر پایه تعداد در ماه',
  REPORT_COST_TOTAL = <any> 'نمودار سالانه برنامه ها بر پایه هزینه انواع برنامه ها',
  REPORT_COST_PLAN_TYPE = <any> 'گزارش ریز هزینه های یک نوع برنامه انتخابی',
  REPORT_CONTRIBUTOR_TOTAL = <any> 'نمودار سالانه برنامه ها بر پایه تعداد مشارکت کنندگان در انواع برنامه ها',
  REPORT_CONTRIBUTOR_PLAN_TYPE = <any> 'گزارش تعداد مشارکت کنندگان یک نوع برنامه انتخابی',
  REPORT_CONTRIBUTOR_GRADE_PLAN_TYPE = <any> 'نمودار تعداد مشارکت کنندگان بر پایه مقطع تحصیلی',
  REPORT_CONTRIBUTOR_FIELD_PLAN_TYPE = <any> 'گزارش تعداد مشارکت کنندگان بر پایه رشته تحصیلی',
  REPORT_CONTRIBUTOR_ARRIVAL_YEAR_PLAN_TYPE = <any> 'نمودار تعداد مشارکت کنندگان بر پایه سال ورودی',
  REPORT_SCORE_TOTAL = <any> 'نمودار سالانه برنامه ها بر پایه امتیاز انواع برنامه ها',
  REPORT_SCORE_PLAN_TYPE = <any> 'گزارش نوع برنامه انتخابی بر پایه امتیاز برنامه ها',
  REPORT_MEMBERSHIP_TOTAL = <any> 'نمودار سالانه برنامه ها بر پایه نوع عضویت انواع برنامه ها',
  REPORT_WITHOUT_MEMBERSHIP_PLAN_TYPE = <any> 'گزارش برنامه های بدون عضویت',
  REPORT_PLAN_ORGANIZATION = <any> 'نمودار برنامه های سازمان ها',
  // REPORT_REMAINING = <any> 'گزارش بر اساس ظرفیت باقیمانده',
}

export enum NewsReportType {
  REPORT_NEWS_ORGANIZATION_YEAR = <any> 'گزارش کلی اخبار به تفکیک سازمان ها',
  REPORT_NEWS_YEAR = <any> 'گزارش سالانه اخبار یک سازمان',
  REPORT_NEWS_MONTH = <any> 'گزارش ماهانه اخبار یک سازمان',
  REPORT_NEWS_YEAR_LIST = <any> 'گزارش جزئیات اخبار سازمان ها',
}

export enum ElectionReportType {
  REPORT_TOTAL_ELECTION = <any> 'نمودار تعداد انتخابات کل سازمان در هر سال',
  REPORT_ORGANIZATIONS_ELECTION_YEAR = <any> 'نمودار سالانه تعداد انتخابات بر پایه سازمان ها',
  REPORT_ORG_ELECTION_YEAR_MONTH = <any> 'نمودار سالانه تعداد انتخابات یک سازمان بر پایه ماه ها',
  REPORT_ORG_ELECTION_VOTER = <any> 'نمودار سالانه تعداد رای دهندگان انتخابات یک سازمان بر پایه ماه ها',
  // REPORT_ORGANIZATIONS_CANDIDA = <any> 'گزارش تعداد کاندیداها به تفکیک سازمان',
  REPORT_ORG_ELECTION_LIST = <any> 'گزارش انتخابات یک سازمان',
}
