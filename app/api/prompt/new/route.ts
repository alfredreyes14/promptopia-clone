import { connectToDB } from "@utils/database"
import Prompt from "@models/prompt"

export const POST = async (req: any, res: any) => {
  const { userId, prompt, tag } = await req.json()
  try {
    await connectToDB()
    const newPrompt = new Prompt({
      creator: userId,
      tag: tag.trim(),
      prompt: prompt.trim()
    })

    await newPrompt.save()

    return new Response(JSON.stringify(newPrompt), { status: 201 })
  } catch (error) {
    return new Response('Erro in creating a new Prompt', { status: 500 })
  }
}