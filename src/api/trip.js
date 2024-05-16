import { localAxios } from "@/util/http-commons";

const local = localAxios();

const shortestPathByPlanList = (planId, success, fail) => {
    local.get(`trip/plan/${planId}/trip/s`).then(success).catch(fail);
};

export { shortestPathByPlanList };
