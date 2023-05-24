const SC_TRANSFER_ORDER_STATUS = {
  CREATED: {
    code: 0,
    desc: '待审核'
  },
  APPROVE_PASS: {
    code: 3,
    desc: '审核通过'
  },
  APPROVE_REFUSE: {
    code: 6,
    desc: '审核拒绝'
  },
  PART_RECEIVED: {
    code: 9,
    desc: '部分收货'
  },
  RECEIVED: {
    code: 12,
    desc: '已收货'
  }
}

export default SC_TRANSFER_ORDER_STATUS
