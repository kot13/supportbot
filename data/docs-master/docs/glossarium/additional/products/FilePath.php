<?php

namespace Products;

readonly class FilePath
{
    public string $path;

    /**
     * @throws \InvalidArgumentException
     */
    public function __construct(string $path)
    {
        $path = trim($path);
        if ('' === $path) {
            throw new \InvalidArgumentException('Path is empty. Available value: non-empty string.');
        }

        $this->path = $path;
    }

    public function __toString(): string
    {
        return $this->path;
    }
}
