<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityImage extends Model
{
    protected $fillable = [
        'activity_id',
        'path',
        'alt_text',
        'order',
        'is_cover',
        'is_display_image',
    ];

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
}