export interface CustomerSettleBizItemBo {
/**
* 单据ID
*/
id: string;

/**
* 单据号
*/
code: string;

/**
* 应付金额
*/
totalPayAmount: number;

/**
* 已付金额
*/
totalPayedAmount: number;

/**
* 已优惠金额
*/
totalDiscountAmount: number;

/**
* 未付款金额
*/
totalUnPayAmount: number;

/**
* 审核时间
*/
approveTime: string;

/**
* 
*/
serialVersionUID: long;

}
