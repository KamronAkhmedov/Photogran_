import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostSchema } from "@/lib/validation"
import { useNavigate } from "react-router-dom"
import { useToast } from "../ui/use-toast"
import { useUserContext } from "@/context/AuthContext"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import { DocumentData } from "firebase/firestore"
import Loader from "../shared/Loader"

type PostFormProps = {
  post?: DocumentData
  action: 'Create' | 'Update'
  postId?: string
}

const PostForm = ({ post, action, postId }: PostFormProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useUserContext()


  // 1. Define form.
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      caption: post ? post?.caption : '',
      file: [],
      location: post ? post?.location : '',
      tags: post ? post?.tags.join(', ') : ''
    },
  })

  // Query
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost()
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost()

  // 2. Define a submit handler.
  const handleSubmit = async (values: z.infer<typeof PostSchema>) => {
    // ACTION = UPDATE
    if (post && action === 'Update') {
      const updatedPost = await updatePost({
        ...values,
        imagePath: post.imagePath,
        imageUrl: post.imageUrl,
        postId
      })

      if (!updatedPost) {
        toast({ title: `${action} post failed. Please try again` })
      }

      return navigate(`/posts/${post.postId}`)
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...values,
      userId: user.id
    })

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again`
      })
    }
    navigate('/')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags(separated by comma ',')</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" placeholder="nature, mountain, science..." {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4 hover:brightness-125"
            onClick={() => navigate(-1)}
          >Cansel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap hover:brightness-110"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm