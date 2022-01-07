#include "pxt.h"

namespace GetUnicode{


    int getUnicode(char *char_data)
    {
        wchar_t char_uni[1]={0}
        setlocale(LC_ALL, "");

        mbstowcs(char_uni, char_data, 1);
        int uni = char_uni[0];
        return uni;
    }
}