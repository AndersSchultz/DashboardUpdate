export async function send(req, res) { // this function will be launched when the API is called.
  try {
    res.send({ success: true, message: 'it workds' }) // send the lyrics
  } catch (err) {
    res.send(err) // send the thrown error
  }
}
