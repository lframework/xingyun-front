const GEN_KEY_TYPE = {
  AUTO: {
    code: 0,
    desc: '自增ID'
  },
  UUID: {
    code: 1,
    desc: 'UUID'
  },
  SNOW_FLAKE: {
    code: 2,
    desc: '雪花算法ID'
  }
}
export default GEN_KEY_TYPE
