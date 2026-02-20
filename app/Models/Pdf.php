<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pdf extends Model
{
    //
    protected $fillable = [
        'title', 'pdf', 'description',
    ];
}
