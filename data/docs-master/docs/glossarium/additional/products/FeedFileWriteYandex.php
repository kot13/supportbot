<?php

namespace Products;

class FeedFileWriteYandex implements IFeedFileWrite
{
    public function write(FilePath $path, Offer ...$offers): void
    {
        $content = $this->generateContent(...$offers);
        $this->writeFile($path, $content);
    }

    private function generateContent(Offer ...$offers): string
    {
        $offersContent = [];
        $index = 0;
        foreach ($offers as $offer) {
            $offersContent[] = (!$index ? "\t" : "\t\t") . $this->generateOffer($offer);
            $index++;
        }

        $offersContent = implode("\n", $offersContent);

        $feedContent = '<?xml version="1.0" encoding="utf-8"?>
<yml_catalog>
  <shop>
    <offers>
      ' . $offersContent . '
    </offers>
  </shop>
</yml_catalog>';
        return trim($feedContent);
    }

    private function generateOffer(Offer $offer): string
    {
        $offerId = $offer->offerId;

        $groupId = $offer->groupId;
        if ('' !== $groupId) {
            $groupId = "<group_id>$groupId</group_id>";
        }

        $name = $offer->name;
        if ('' !== $name) {
            $name = "<name>$name</name>";
        }

        $description = $offer->description;
        if ('' !== $description) {
            $description = "<description>$description</description>";
        }

        $url = $offer->url;
        if ('' !== $url) {
            $url = "<url>$url</url>";
        }

        $size = $offer->size;
        if ('' !== $size) {
            $size = "<size>$size</size>";
        }

        $color = $offer->color;
        if ('' !== $color) {
            $color = "<color>$color</color>";
        }

        $availability = $offer->availability;
        if ('' !== $availability) {
            $availability = "available=\"$availability\"";
        }

        $currency = $offer->currency;
        if ('' !== $currency) {
            $currency = "<currencyid>$currency</currencyid>";
        }

        $price = $offer->price;
        if ('' !== $price) {
            $price = "<price>$price</price>";
        }

        $oldPrice = $offer->oldPrice;
        if ('' !== $oldPrice) {
            $oldPrice = "<oldprice>$oldPrice</oldprice>";
        }

        $images = '';
        foreach ($offer->images as $image) {
            $images .= "\t\t\t<picture>$image</picture>" . PHP_EOL;
        }

        $vendor = $offer->vendor;
        if ('' !== $vendor) {
            $vendor = "<vendor>$vendor</vendor>";
        }

        $vendorCode = $offer->vendorCode;
        if ('' !== $vendorCode) {
            $vendorCode = "<vendorcode>$vendorCode</vendorcode>";
        }

        $model = $offer->model;
        if ('' !== $model) {
            $model = "<model>$model</model>";
        }

        $adult = $offer->adult;
        if (null !== $adult) {
            $adult = (int)$adult;
            $adult = "<adult>$adult</adult>";
        }

        $values = array_diff([
            $groupId,
            $name,
            $description,
            $url,
            $size,
            $color,
            $price,
            $oldPrice,
            $currency,
            trim($images),
            $vendor,
            $vendorCode,
            $model,
            $adult,
        ], ['']);
        if ($values) {
            $values = PHP_EOL . "\t\t\t" . implode(PHP_EOL . "\t\t\t", $values) . PHP_EOL;
        } else {
            $values = '';
        }

        return trim("
<offer id=\"$offerId\" $availability>$values\t\t</offer>
    ");
    }

    private function writeFile(FilePath $path, string $content): void
    {
        file_put_contents($path, $content);
    }
}
