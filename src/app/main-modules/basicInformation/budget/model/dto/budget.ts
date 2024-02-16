import {Currency} from '../../../currency/model/dto/currency';

export class Budget {
    id: string;
    title: string;
    description: string;
    code: string;
    budgetAmount: number;
    // currency: Currency = new Currency();
    currencyId: string;
    currencyName: string;
    // deleted: boolean;
    // organId: string;
    primaryBudgetAmount: number;
    finalBudgetAmount: number;
}

