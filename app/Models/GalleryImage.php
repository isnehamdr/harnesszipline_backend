<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryImage extends Model
{
    protected $fillable = [
        'gallery_id',
        'path',
        'alt_text',
        'order',
        'is_cover',
        'is_display_image',
    ];

    public function gallery()
    {
        return $this->belongsTo(Gallery::class);
    }
}