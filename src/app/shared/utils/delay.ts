
/**
 *
 * @remainder
 * Don't forget to await this function :)
 * @export
 * @param {number} ms 
 * The time in milliseconds you want to wait before continuing the execution of the program.
 */
export async function delay(ms: number) {
    await new Promise((res, rej) => setTimeout(res, ms))
}