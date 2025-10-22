import { MDListItem } from "@nan0web/markdown"

/** @typedef {import("@nan0web/markdown/types/MDElement").MDElementProps} MDElementProps */
/**
 * @typedef {Object} ChangeProps
 * @property {Date | null} date
 */

export default class Change extends MDListItem {
	/** @type {Date | null} */
	date
	/**
	 * @param {MDElementProps & ChangeProps} props
	 */
	constructor(props) {
		super(props)
		const {
			date = null
		} = props
		this.date = date ? new Date(date) : null
	}
}
