import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, ImagePlus } from 'lucide-react';
import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageCropper } from './ImageCropper';
import { API_URL } from '@/lib/api';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Write your story...',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] max-w-none font-serif',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result as string);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="border border-input rounded-md">
      <div className="flex items-center gap-1 p-2 border-b border-input bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-accent' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlus className="h-4 w-4" />
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onSelectImage} />
        </Button>
        <div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
      <Dialog open={cropOpen} onOpenChange={setCropOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Crop image</DialogTitle>
          </DialogHeader>
          {tempImage && (
            <ImageCropper
              imageSrc={tempImage}
              aspect={16/9}
              onCancel={() => setCropOpen(false)}
              onCropped={(url) => {
                // upload cropped image if backend available
                fetch(url).then(r => r.blob()).then(async (blob) => {
                  const form = new FormData();
                  form.append('image', blob, 'attachment.png');
                  try {
                    const res = await fetch(`${API_URL}/api/uploads`, { method: 'POST', body: form, credentials: 'include' });
                    if (res.ok) {
                      const data = await res.json();
                      const src = data.url.startsWith('http') ? data.url : `${API_URL}${data.url}`;
                      editor.chain().focus().insertContent(`<img src="${src}" alt="attachment" />`).run();
                      return;
                    }
                  } catch {}
                  editor.chain().focus().insertContent(`<img src="${url}" alt="attachment" />`).run();
                });
                setCropOpen(false);
                setTempImage(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};