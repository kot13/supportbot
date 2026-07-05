<?php

namespace Products;

class FeedFileWriteGoogle implements IFeedFileWrite
{
    public function write(FilePath $path, Offer ...$offers): void
    {
        $content = $this->generateContent(...$offers);
        $this->writeFile($path, $content);
    }

    private function generateContent(Offer ...$offers): string
    {
        $offersContent = [];
        foreach ($offers as $offer) {
            $offersContent[] = $this->generateOffer($offer);
        }

        $offersContent = implode("\n", $offersContent);

        $feedContent = '<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>Example - Google Store</title>
<link>https://store.google.com</link>
<description>This is an example of a basic RSS 2.0 document containing a single item</description>
' . $offersContent . '
</channel>
</rss>';
        return trim($feedContent);
    }

    private function generateOffer(Offer $offer): string
    {
        $offerId = $offer->offerId;

        $groupId = $offer->groupId;
        if ('' !== $groupId) {
            $groupId = "<g:group_id>$groupId</g:group_id>";
        }

        $name = $offer->name;
        if ('' !== $name) {
            $name = "<g:title>$name</g:title>";
        }

        $description = $offer->description;
        if ('' !== $description) {
            $description = "<g:description>$description</g:description>";
        }

        $url = $offer->url;
        if ('' !== $url) {
            $url = "<g:link>$url</g:link>";
        }

        $size = $offer->size;
        if ('' !== $size) {
            $size = "<g:size>$size</g:size>";
        }

        $color = $offer->color;
        if ('' !== $color) {
            $color = "<g:color>$color</g:color>";
        }

        $availability = $offer->availability;
        if ('' !== $availability) {
            $availability = "<g:availability>$availability</g:availability>";
        }

        $currency = $offer->currency;

        $price = $offer->price;
        if ('' !== $price) {
            $price = "<g:price>$price $currency</g:price>";
        }

        $oldPrice = $offer->oldPrice;
        if ('' !== $oldPrice) {
            $oldPrice = "<g:sale_price>$oldPrice $currency</g:sale_price>";
        }

        $images = '';
        foreach ($offer->images as $image) {
            $images .= "\t<g:image_link>$image</g:image_link>" . PHP_EOL;
        }

        $values = array_diff([
            $groupId,
            $name,
            $description,
            $url,
            $size,
            $color,
            $availability,
            $price,
            $oldPrice,
            trim($images),
        ], ['']);
        if ($values) {
            $values = PHP_EOL . "\t" . implode(PHP_EOL . "\t", $values);
        } else {
            $values = '';
        }
        $values = "\t<g:id>$offerId</g:id>$values";

        return trim("
<item>
$values
</item>
    ");
    }

    private function writeFile(FilePath $path, string $content): void
    {
        file_put_contents($path, $content);
    }
}
