# Tags

To change the list of tags use the `tags` property from `<IASContainer>` config.

> **Note:** Tags max length is 4000 (in bytes, for comma concatenated string).

## Example

```tsx
import { StoryList, IASContainer, StoryListApi } from "@inappstory/react-sdk";

export const App = () => {
    const [tags, setTags] = useState<string[]>(['default-tag']);
    const storyListRef = useRef<StoryListApi | null>(null);

    useEffect(() => {
        storyListRef.current?.reload() // Reload stories after tags changed (Optional)
    }, [tags])

    useEffect(() => {
        setTags(['new-tag'])
    }, [])

    return <IASContainer config={{ apiKey: "{projectToken}", tags }}>
        <StoryList ref={storyListRef} feed="default" />
    </IASContainer>
```