import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PartActionComponent} from './action/part-action.component';
import {WarrantyActionComponent} from '../warranty/feature/action/warranty-action.component';
import {InventoryActionComponent} from '../inventory/feature/action/inventory-action.component';
import {AssetConsumingReferenceActionComponent} from '../assetConsumingReference/feature/action/asset-consuming-reference-action.component';
import {PartListComponent} from './list/part-list.component';


const routes: Routes = [
  {path: '' , component: PartListComponent},
  {path: 'action' , component: PartActionComponent},
  {path: 'action/actionForWarranty' , component: WarrantyActionComponent},
  {path: 'action/actionForInventory' , component: InventoryActionComponent},
  {path: 'action/actionForAssetConsumingReference' , component: AssetConsumingReferenceActionComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartRoutingModule { }
