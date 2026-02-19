<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Home extends Model
{
    //
     protected $fillable = [
        'image',
        'video',
        'is_archived',
        'metadata_json'
    ];
}
