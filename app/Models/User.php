<?php

namespace App\Models;

/*
 * Модель USER
 * 
 * Представляет таблицу users. Наследует Authenticatable (не просто Model),
 * потому что эта модель используется для входа/выхода из системы.
 * Authenticatable добавляет методы для работы с паролями, токенами и т.д.
 */

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /*
     * $fillable — список полей, которые МОЖНО заполнять массово.
     * 
     * Что это значит: когда ты делаешь User::create($request->all()),
     * Laravel возьмёт из запроса ТОЛЬКО эти поля. Это защита —
     * злоумышленник не сможет подсунуть role='admin' через форму,
     * потому что 'role' НЕТ в $fillable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar',
    ];

    /*
     * $hidden — поля, которые НЕ попадут в JSON-ответ.
     * Когда Laravel отправляет данные пользователя на фронтенд (React),
     * пароль и remember_token будут автоматически скрыты.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /*
     * casts — Laravel автоматически преобразует эти поля в нужный тип.
     * email_verified_at хранится в БД как строка, но Laravel
     * автоматически превратит её в объект DateTime.
     * password будет автоматически хеширован при записи.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ========== СВЯЗИ (Relationships) ==========

    /*
     * У пользователя может быть МНОГО объявлений (cars).
     * hasMany = "имеет много"
     * 
     * Использование: $user->cars — вернёт все объявления пользователя
     */
    public function cars()
    {
        return $this->hasMany(Car::class);
    }

    /*
     * У пользователя может быть МНОГО избранных авто.
     * 
     * Использование: $user->favorites — вернёт все записи избранного
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    /*
     * Избранные АВТОМОБИЛИ пользователя (через промежуточную таблицу favorites).
     * belongsToMany = связь "многие ко многим"
     * 
     * Разница с favorites():
     *   $user->favorites — вернёт записи из таблицы favorites (id, user_id, car_id)
     *   $user->favoriteCars — вернёт сами объекты Car (id, price, year...)
     */
    public function favoriteCars()
    {
        return $this->belongsToMany(Car::class, 'favorites');
    }

    // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

    /*
     * Проверка: является ли пользователь администратором?
     * 
     * Использование: if ($user->isAdmin()) { ... }
     * Это удобнее чем каждый раз писать if ($user->role === 'admin')
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
