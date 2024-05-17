import { localAxios } from "@/util/http-commons";

const local = localAxios();

const shortestPathByPlanList = (planId, success, fail) => {
    local.get(`trip/plan/${planId}/trip/s`).then(success).catch(fail);
};

const saveMemoAPI = (plan, success, fail) => {
    console.log(plan);
    local.patch(`trip/plan/${plan.planId}/memo`, plan).then(success).catch(fail);
};

export { shortestPathByPlanList, saveMemoAPI };
