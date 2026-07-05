<?php

namespace Products;

interface IFeedFileWrite
{
    public function write(FilePath $path, Offer ...$offers): void;
}
