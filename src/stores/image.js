import { defineStore } from "pinia";
import { ref } from "vue";

import content12 from "@/assets/image/12.png";
import content14 from "@/assets/image/14.png";
import content15 from "@/assets/image/15.png";
import content25 from "@/assets/image/25.png";
import content28 from "@/assets/image/28.png";
import content32 from "@/assets/image/32.png";
import content38 from "@/assets/image/38.png";
import content39 from "@/assets/image/39.png";
import defaultProfileImg from "@/assets/image/default_profile_img.png";
import favicon from "@/assets/image/favicon.png";
import noImageLogo from "@/assets/image/no_image_logo.png";
import noImage from "@/assets/image/no_image.jpg";
import successLogo from "@/assets/image/success_logo.png";

export const imageStore = defineStore("image", () => {
    const contentUrl = {
        12: content12,
        14: content14,
        15: content15,
        25: content25,
        28: content28,
        32: content32,
        38: content38,
        39: content39,
    };
    const defaultProfileImgUrl = ref(defaultProfileImg);
    const faviconUrl = ref(favicon);
    const noImageLogoUrl = ref(noImageLogo);
    const noImageUrl = ref(noImage);
    const successLogoUrl = ref(successLogo);

    const getContentImgUrl = (type) => {
        return contentUrl[type];
    };

    return {
        defaultProfileImgUrl,
        faviconUrl,
        noImageLogoUrl,
        noImageUrl,
        successLogoUrl,
        getContentImgUrl,
    };
});
