import * as api from '@/api/base-data/print-template';

export const printMix = {
  methods: {
    lodopPreview(type, printData) {
      api.getSetting(type).then((res) => {
        const templateJson = res.templateJson;
        this.$lodop.preview(templateJson, [printData]);
      });
    },
  },
};
