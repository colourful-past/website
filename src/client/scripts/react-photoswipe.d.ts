

declare module "react-photoswipe" {
    import React = require("react");

    interface IImage
    {
        src: string,
        w: number,
        h: number,
        title: string
    }

    interface PhotoSwipeProps extends React.HTMLAttributes {
        isOpen?: boolean;
        images?: IImage[];
        options?: any;
        onClose?: ()=>void;
    }
    type PhotoSwipe = React.ClassicComponent<PhotoSwipeProps, {}>;
    var PhotoSwipe: React.ClassicComponentClass<PhotoSwipeProps>;
}