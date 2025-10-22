/** @typedef {import("@nan0web/markdown/types/MDElement").MDElementProps} MDElementProps */
/**
 * @typedef {Object} ChangeProps
 * @property {Date | null} date
 */
export default class Change extends MDListItem {
    /**
     * @param {MDElementProps & ChangeProps} props
     */
    constructor(props: MDElementProps & ChangeProps);
    /** @type {Date | null} */
    date: Date | null;
}
export type MDElementProps = import("@nan0web/markdown/types/MDElement").MDElementProps;
export type ChangeProps = {
    date: Date | null;
};
import { MDListItem } from "@nan0web/markdown";
