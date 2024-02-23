import {OrderPayTypeVo} from "@/api/sc/pay-type/model/orderPayTypeVo";
import {SaleProductVo} from "@/api/sc/sale/order/model/saleProductVo";

export interface CreateSaleOrderVo {

/**
* 仓库ID
*/
scId: string;

/**
* 客户ID
*/
customerId: string;

/**
* 销售员ID
*/
salerId: string;

/**
* 商品信息
*/
products: SaleProductVo[];

/**
* 约定支付
*/
payTypes: OrderPayTypeVo[];

/**
* 备注
*/
description: string;

}
