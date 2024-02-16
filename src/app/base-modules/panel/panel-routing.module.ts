import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PanelComponent} from './_index/panel.component';
// import {FormBuilderComponent} from '../../main-modules/formBuilder/form-builder.component';
import {AuthGuardService} from '../../shared/service/auth-guard.service';
// import {FormForViewComponent} from '../../main-modules/formBuilder/fb-feature/form-view/form-for-view/form-for-view.component';

const routes: Routes = [
        {
            path: '',
            component: PanelComponent,
            children: [
                {
                    path: '',
                    loadChildren: '../../main-modules/dashboard/feature/dashboard.module#DashboardModule',
                    canActivate: [AuthGuardService]
                },
                {
                    path: 'security',
                    loadChildren: '../../main-modules/securityManagement/feature/security.module#SecurityModule',
                    canActivate: [AuthGuardService]
                },
                {
                    path: 'user',
                    loadChildren: '../../main-modules/user/feature/user.module#UserModule',
                    canActivate: [AuthGuardService]
                },
                {
                    path: 'basicInformation/organization',
                    loadChildren: '../../main-modules/basicInformation/organization/feature/organization.module#OrganizationModule',
                    canActivate: [AuthGuardService]
                },
                {
                    path: 'basicInformation/city',
                    loadChildren: '../../main-modules/basicInformation/city/feature/city.module#CityModule',
                    canActivate: [AuthGuardService]
                },
                {
                    path: 'basicInformation/warranty',
                    loadChildren: '../../main-modules/basicInformation/city/feature/city.module#CityModule',
                    canActivate: [AuthGuardService]
                },
                {
                    path: 'basicInformation/formCategory',
                    loadChildren: '../../main-modules/basicInformation/formCategory/feature/form-category.module#FormCategoryModule',
                    canActivate: [AuthGuardService]
                },
                {
                    path: 'basicInformation/province',
                    loadChildren: '../../main-modules/basicInformation/province/feature/province.module#ProvinceModule',
                    canActivate: [AuthGuardService]
                },
                {
                    path: 'basicInformation/currency',
                    loadChildren: '../../main-modules/basicInformation/currency/feature/currency.module#CurrencyModule',
                    canActivate: [AuthGuardService]
                },
                {
                    path: 'basicInformation/budget',
                    loadChildren: '../../main-modules/basicInformation/budget/feature/budget.module#BudgetModule',
                    canActivate: [AuthGuardService]
                },
                {
                    path: 'basicInformation/workOrderStatus',
                    loadChildren: '../../main-modules/basicInformation/workOrderStatus/feature/work-order-status.module#WorkOrderStatusModule',
                    canActivate: [AuthGuardService]
                },
                {
                    path: 'basicInformation/propertyCategory',
                    loadChildren: '../../main-modules/basicInformation/propertyCategory/feature/property-category.module#PropertyCategoryModule',
                    canActivate: [AuthGuardService]

                },
                {
                    path: 'basicInformation/unitOfMeasurement',
                    loadChildren: '../../main-modules/basicInformation/unitOfMeasurement/feature/unit-of-measurement.module#UnitOfMeasurementModule',
                    canActivate: [AuthGuardService]
                },
                {
                    path: 'basicInformation/property',
                    loadChildren: '../../main-modules/basicInformation/property/feature/property.module#PropertyModule',
                    canActivate: [AuthGuardService]
                },


                {
                    path: 'basicInformation/company',
                    loadChildren:
                        '../../main-modules/company/feature/company.module#CompanyModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'basicInformation/storage',
                    loadChildren:
                        '../../main-modules/storage/feature/storage.module#StorageModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'assetTemplate',
                    loadChildren:
                        '../../main-modules/assetTemplate/feature/asset-template.module#AssetTemplateModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'asset',
                    loadChildren:
                        '../../main-modules/asset/feature/asset.module#AssetModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'scheduleMaintenance',
                    loadChildren:
                        '../../main-modules/scheduleMaintenance/feature/schedule-maintenance.module#ScheduleMaintenanceModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'workOrderRandom',
                    loadChildren:
                        '../../main-modules/workOrder/feature/work-order.module#WorkOrderModule',
                    canActivate:
                        [AuthGuardService]
                } ,
                {
                    path: 'workOrderScheduling',
                    loadChildren:
                        '../../main-modules/work-order-schedule/work-order-schedule.module#WorkOrderScheduleModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'assignedWorkOrder',
                    loadChildren:
                        '../../main-modules/assignedWorkOrder/feature/assigned-work-order.module#AssignedWorkOrderModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'basicInformation/category',
                    loadChildren:
                        '../../main-modules/category/feature/category.module#CategoryModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'basicInformation/chargeDepartment',
                    loadChildren:
                        '../../main-modules/basicInformation/chargeDepartment/feature/charge-department.module#ChargeDepartmentModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'basicInformation/organizationStructure',
                    loadChildren:
                        '../../main-modules/activity/feature/organization/organization.module#OrganizationModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'activity',
                    loadChildren:
                        '../../main-modules/activity/feature/activity.module#ActivityModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'part',
                    loadChildren:
                        '../../main-modules/part/feature/part.module#PartModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'project',
                    loadChildren:
                        '../../main-modules/project/feature/project.module#ProjectModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'taskGroup',
                    loadChildren:
                        '../../main-modules/taskGroup/feature/task-group.module#TaskGroupModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                // {
                //     path: 'formBuilder1',
                //     component:
                //     FormBuilderComponent,
                //     canActivate:
                //         [AuthGuardService]
                // },
                {
                    path: 'formBuilder',
                    loadChildren: '../../main-modules/form-builder2/form-builder2.module#FormBuilder2Module',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                // {
                //     path: 'formBuilder/view',
                //     component:
                //     FormForViewComponent,
                //     canActivate:
                //         [AuthGuardService]
                // }
                // ,
                {
                    path: 'currentInventory',
                    loadChildren:
                        '../../main-modules/currentInventory/feature/current-inventory.module#CurrentInventoryModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'adjustmentInventory',
                    loadChildren:
                        '../../main-modules/adjustmentInventory/adjustment-inventory.module#AdjustmentInventoryModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'billOfMaterialsGroups',
                    loadChildren:
                        '../../main-modules/billOfMaterialsGroups/feature/bill-of-materials-groups.module#BillOfMaterialsGroupsModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'assignedAsset',
                    loadChildren:
                        '../../main-modules/assignedAsset/feature/assigned-asset.module#AssignedAssetModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'assignedPart',
                    loadChildren:
                        '../../main-modules/assignedPart/feature/assigned-part.module#AssignedPartModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'inbox',
                    loadChildren:
                        '../../main-modules/notifications/inbox/feature/inbox.module#InboxModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'sent',
                    loadChildren:
                        '../../main-modules/notifications/sent/feature/sent.module#SentModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'systemMessages',
                    loadChildren:
                        '../../main-modules/notifications/systemMessages/feature/system-messages.module#SystemMessagesModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'trash',
                    loadChildren:
                        '../../main-modules/notifications/trash/feature/trash.module#TrashModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'submitWorkRequest',
                    loadChildren:
                        '../../main-modules/submitWorkRequest/feature/submit-work-request.module#SubmitWorkRequestModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'reading',
                    loadChildren:
                        '../../main-modules/reading/feature/reading.module#ReadingModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'worktable',
                    loadChildren:
                        '../../main-modules/worktable/feature/worktable.module#WorktableModule',
                    canActivate:
                        [AuthGuardService]
                },
                {
                    path: 'workTableSchedule',
                    loadChildren:
                        '../../main-modules/work-table-schedule/work-table-schedule.module#WorkTableScheduleModule',
                    canActivate:
                        [AuthGuardService]
                }
                ,
                {
                    path: 'worktableActiveHistory',
                    loadChildren:
                        '../../main-modules/workTableHistory/feature/work-table-history.module#WorkTableHistoryModule',
                    canActivate:
                        [AuthGuardService]
                },

                ///////// خانواده گروه دارایی
                {
                    path: 'assetCategory',
                    loadChildren:
                        '../../main-modules/basicInformation/asset-category/asset-category.module#AssetCategoryModule',
                    canActivate:
                        [AuthGuardService]
                },
                /////////   گزارش گیری
                {
                    path: 'reporting',
                    loadChildren:
                        '../../main-modules/reporting/reporting.module#ReportingModule',
                    canActivate:
                        [AuthGuardService]
                },
                /////////   نگهداری و تعمیرات برنامه ریزی شده
                {
                    path: 'scheduling',
                    loadChildren:
                        '../../main-modules/scheduling/scheduling.module#SchedulingModule',
                    canActivate:
                        [AuthGuardService]
                },
                // <!--                        نوع فعالیت-->
                {
                    path: 'typeOfActivity',
                    loadChildren:
                        '../../main-modules/basicInformation/type-of-activity/type-of-activity.module#TypeOfActivityModule',
                    canActivate:
                        [AuthGuardService]
                },
                // <!--                        رسته کاری-->
                {
                    path: 'workingField',
                    loadChildren:
                        '../../main-modules/basicInformation/working-field/working-field.module#WorkingFieldModule',
                    canActivate:
                        [AuthGuardService]
                },
                // <!--                        روانکارها-->

                {
                    path: 'lubricant',
                    loadChildren:
                        '../../main-modules/basicInformation/lubricant/lubricant.module#LubricantModule',
                    canActivate:
                        [AuthGuardService]
                },
                // <!--                        درجه اهمیت-->
                {
                    path: 'degreeOfImportance',
                    loadChildren:
                        '../../main-modules/basicInformation/degree-of-importance/degree-of-importance.module#DegreeOfImportanceModule',
                    canActivate:
                        [AuthGuardService]
                } , {
                    path: 'calender',
                    loadChildren:
                        '../../main-modules/calender/calender.module#CalenderModule',
                    canActivate:
                        [AuthGuardService]
                }
            ]
        }
    ]
;

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PanelRoutingModule {
}
